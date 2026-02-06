#!/usr/bin/env bash
# =============================================================================
# macOS Security Audit Script
# =============================================================================
# Run on your MacBook: chmod +x macos-security-audit.sh && sudo ./macos-security-audit.sh
#
# Checks system configuration against hardening best practices.
# Designed for macOS Ventura / Sonoma / Sequoia.
# =============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0
INFO_COUNT=0

pass()  { ((PASS_COUNT++)); echo -e "  ${GREEN}[PASS]${NC} $1"; }
fail()  { ((FAIL_COUNT++)); echo -e "  ${RED}[FAIL]${NC} $1"; }
warn()  { ((WARN_COUNT++)); echo -e "  ${YELLOW}[WARN]${NC} $1"; }
info()  { ((INFO_COUNT++)); echo -e "  ${CYAN}[INFO]${NC} $1"; }

section() {
    echo ""
    echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD} $1${NC}"
    echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# ---------------------------------------------------------------------------
# Pre-flight
# ---------------------------------------------------------------------------
if [[ "$(uname)" != "Darwin" ]]; then
    echo "This script is designed for macOS. Exiting."
    exit 1
fi

echo -e "${BOLD}"
echo "  ╔══════════════════════════════════════════════════════════════╗"
echo "  ║              macOS Security Audit                          ║"
echo "  ║              $(date '+%Y-%m-%d %H:%M:%S')                           ║"
echo "  ╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

MACOS_VERSION=$(sw_vers -productVersion)
info "macOS version: $MACOS_VERSION"
info "Hardware: $(sysctl -n hw.model 2>/dev/null || echo 'unknown')"
info "Hostname: $(hostname)"
info "Current user: $(whoami)"

# ---------------------------------------------------------------------------
# 1. SYSTEM INTEGRITY & BOOT SECURITY
# ---------------------------------------------------------------------------
section "1. SYSTEM INTEGRITY & BOOT SECURITY"

# SIP (System Integrity Protection)
SIP_STATUS=$(csrutil status 2>/dev/null || echo "unknown")
if echo "$SIP_STATUS" | grep -q "enabled"; then
    pass "System Integrity Protection (SIP) is enabled"
else
    fail "System Integrity Protection (SIP) is DISABLED — re-enable immediately"
fi

# Gatekeeper
GK_STATUS=$(spctl --status 2>/dev/null || echo "unknown")
if echo "$GK_STATUS" | grep -q "assessments enabled"; then
    pass "Gatekeeper is enabled"
else
    fail "Gatekeeper is DISABLED"
fi

# Secure Boot (Apple Silicon / T2)
if system_profiler SPiBridgeDataType 2>/dev/null | grep -qi "secure boot"; then
    SECURE_BOOT=$(system_profiler SPiBridgeDataType 2>/dev/null | grep -i "secure boot" || true)
    if echo "$SECURE_BOOT" | grep -qi "full"; then
        pass "Secure Boot is set to Full Security"
    else
        warn "Secure Boot is NOT set to Full Security: $SECURE_BOOT"
    fi
elif [[ $(uname -m) == "arm64" ]]; then
    info "Apple Silicon detected — Secure Boot is managed by the Secure Enclave"
else
    info "Secure Boot status could not be determined (non-T2 Intel Mac)"
fi

# FileVault
FV_STATUS=$(fdesetup status 2>/dev/null || echo "unknown")
if echo "$FV_STATUS" | grep -q "On"; then
    pass "FileVault disk encryption is ON"
else
    fail "FileVault disk encryption is OFF — enable it in System Settings > Privacy & Security"
fi

# Firmware password (Intel Macs)
if [[ $(uname -m) != "arm64" ]]; then
    if firmwarepasswd -check 2>/dev/null | grep -q "Yes"; then
        pass "Firmware password is set (Intel Mac)"
    else
        warn "No firmware password set (Intel Mac) — consider setting one"
    fi
fi

# ---------------------------------------------------------------------------
# 2. FIREWALL
# ---------------------------------------------------------------------------
section "2. FIREWALL"

# Application Firewall
FW_STATE=$(/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate 2>/dev/null || echo "unknown")
if echo "$FW_STATE" | grep -q "enabled"; then
    pass "Application Firewall is enabled"
else
    fail "Application Firewall is DISABLED — enable in System Settings > Network > Firewall"
fi

# Stealth mode
STEALTH=$(/usr/libexec/ApplicationFirewall/socketfilterfw --getstealthmode 2>/dev/null || echo "unknown")
if echo "$STEALTH" | grep -q "enabled"; then
    pass "Stealth mode is enabled (machine does not respond to probes)"
else
    warn "Stealth mode is disabled — enable for better network invisibility"
fi

# Block all incoming
BLOCK_ALL=$(/usr/libexec/ApplicationFirewall/socketfilterfw --getblockall 2>/dev/null || echo "unknown")
if echo "$BLOCK_ALL" | grep -q "enabled"; then
    info "Block-all-incoming mode is enabled (very restrictive)"
else
    info "Block-all-incoming mode is off (normal for most users)"
fi

# Signed apps auto-allow
SIGNED=$(/usr/libexec/ApplicationFirewall/socketfilterfw --getallowsigned 2>/dev/null || echo "unknown")
if echo "$SIGNED" | grep -q "enabled"; then
    warn "Signed apps are automatically allowed through firewall — consider disabling for tighter control"
fi

# ---------------------------------------------------------------------------
# 3. USER ACCOUNTS & AUTHENTICATION
# ---------------------------------------------------------------------------
section "3. USER ACCOUNTS & AUTHENTICATION"

# Check for Guest account
GUEST_ENABLED=$(defaults read /Library/Preferences/com.apple.loginwindow GuestEnabled 2>/dev/null || echo "0")
if [[ "$GUEST_ENABLED" == "1" ]]; then
    fail "Guest account is ENABLED — disable it"
else
    pass "Guest account is disabled"
fi

# Auto-login
AUTO_LOGIN=$(defaults read /Library/Preferences/com.apple.loginwindow autoLoginUser 2>/dev/null || echo "NONE")
if [[ "$AUTO_LOGIN" != "NONE" ]]; then
    fail "Auto-login is enabled for user: $AUTO_LOGIN — disable it immediately"
else
    pass "Auto-login is disabled"
fi

# Password hint display
HINTS=$(defaults read /Library/Preferences/com.apple.loginwindow RetriesUntilHint 2>/dev/null || echo "0")
if [[ "$HINTS" != "0" ]]; then
    warn "Password hints are shown after $HINTS failed attempts — set to 0"
else
    pass "Password hints are not displayed at login"
fi

# List admin users
info "Admin users on this system:"
dscl . -read /Groups/admin GroupMembership 2>/dev/null | sed 's/GroupMembership: /  /' || info "  Could not enumerate admin group"

# Check for users with empty passwords
while IFS= read -r user; do
    if dscl . -read "/Users/$user" AuthenticationAuthority 2>/dev/null | grep -q "ShadowHash"; then
        : # Has a password mechanism
    fi
done < <(dscl . -list /Users | grep -v '^_')

# Screen saver password requirement
SCREEN_LOCK=$(defaults read com.apple.screensaver askForPassword 2>/dev/null || echo "unknown")
if [[ "$SCREEN_LOCK" == "1" ]]; then
    DELAY=$(defaults read com.apple.screensaver askForPasswordDelay 2>/dev/null || echo "unknown")
    if [[ "$DELAY" == "0" ]]; then
        pass "Screen lock requires password immediately"
    else
        warn "Screen lock password delay is ${DELAY}s — set to 0 (immediate)"
    fi
else
    fail "Screen saver does NOT require a password — enable it"
fi

# ---------------------------------------------------------------------------
# 4. SHARING & REMOTE ACCESS
# ---------------------------------------------------------------------------
section "4. SHARING & REMOTE ACCESS SERVICES"

check_sharing() {
    local service_name="$1"
    local launchd_label="$2"
    if launchctl list "$launchd_label" &>/dev/null; then
        fail "$service_name is RUNNING"
    else
        pass "$service_name is not running"
    fi
}

# Remote Login (SSH)
if systemsetup -getremotelogin 2>/dev/null | grep -qi "on"; then
    warn "Remote Login (SSH) is ON — disable unless needed"
else
    pass "Remote Login (SSH) is off"
fi

# Screen Sharing / VNC
check_sharing "Screen Sharing (VNC)" "com.apple.screensharing"

# File Sharing (SMB/AFP)
if launchctl list 2>/dev/null | grep -q "com.apple.smbd"; then
    warn "SMB File Sharing appears to be running"
else
    pass "SMB File Sharing is not running"
fi

# Remote Management (ARD)
check_sharing "Remote Management (ARD)" "com.apple.RemoteDesktop.agent"

# AirDrop
AIRDROP=$(defaults read com.apple.NetworkBrowser DisableAirDrop 2>/dev/null || echo "0")
if [[ "$AIRDROP" == "1" ]]; then
    pass "AirDrop is disabled"
else
    warn "AirDrop is enabled — disable if not needed, or set to Contacts Only"
fi

# Bluetooth
BT_DISCOVERABLE=$(defaults read /Library/Preferences/com.apple.Bluetooth ControllerPowerState 2>/dev/null || echo "unknown")
info "Bluetooth power state: $BT_DISCOVERABLE (1=on, 0=off)"

# Printer sharing
if cupsctl 2>/dev/null | grep -q "_share_printers=1"; then
    warn "Printer sharing is enabled"
else
    pass "Printer sharing is not enabled"
fi

# ---------------------------------------------------------------------------
# 5. SOFTWARE & UPDATES
# ---------------------------------------------------------------------------
section "5. SOFTWARE UPDATES"

# Auto-update
AUTO_CHECK=$(defaults read /Library/Preferences/com.apple.SoftwareUpdate AutomaticCheckEnabled 2>/dev/null || echo "unknown")
if [[ "$AUTO_CHECK" == "1" ]]; then
    pass "Automatic update checking is enabled"
else
    fail "Automatic update checking is DISABLED"
fi

AUTO_DOWNLOAD=$(defaults read /Library/Preferences/com.apple.SoftwareUpdate AutomaticDownload 2>/dev/null || echo "unknown")
if [[ "$AUTO_DOWNLOAD" == "1" ]]; then
    pass "Automatic download of updates is enabled"
else
    warn "Automatic download of updates is disabled"
fi

# Critical updates (XProtect, MRT)
CRITICAL=$(defaults read /Library/Preferences/com.apple.SoftwareUpdate CriticalUpdateInstall 2>/dev/null || echo "unknown")
if [[ "$CRITICAL" == "1" ]]; then
    pass "Critical security updates auto-install is enabled"
else
    fail "Critical security updates auto-install is DISABLED — enable immediately"
fi

# XProtect version
if [[ -f /Library/Apple/System/Library/CoreServices/XProtect.bundle/Contents/version.plist ]]; then
    XPROTECT_VER=$(/usr/libexec/PlistBuddy -c "Print CFBundleShortVersionString" /Library/Apple/System/Library/CoreServices/XProtect.bundle/Contents/version.plist 2>/dev/null || echo "unknown")
    info "XProtect version: $XPROTECT_VER"
fi

# ---------------------------------------------------------------------------
# 6. PRIVACY & DATA PROTECTION
# ---------------------------------------------------------------------------
section "6. PRIVACY & DATA PROTECTION"

# Safari safe browsing
SAFARI_SAFE=$(defaults read com.apple.Safari WarnAboutFraudulentWebsites 2>/dev/null || echo "unknown")
if [[ "$SAFARI_SAFE" == "1" ]]; then
    pass "Safari fraudulent website warning is enabled"
else
    warn "Safari fraudulent website warning may be disabled"
fi

# Location Services
if defaults read /var/db/locationd/Library/Preferences/ByHost/com.apple.locationd LocationServicesEnabled 2>/dev/null | grep -q "1"; then
    info "Location Services are enabled — review which apps have access"
else
    info "Location Services status could not be determined"
fi

# Lockdown Mode
LOCKDOWN=$(defaults read /Library/Managed\ Preferences/.GlobalPreferences LDMGlobalEnabled 2>/dev/null || echo "unknown")
if [[ "$LOCKDOWN" == "1" ]]; then
    pass "Lockdown Mode is ENABLED (maximum protection)"
else
    warn "Lockdown Mode is not enabled — for high-threat environments, enable it in Settings > Privacy & Security"
fi

# Find My Mac
info "Check Find My Mac status manually: System Settings > Apple ID > Find My"

# ---------------------------------------------------------------------------
# 7. NETWORK SECURITY
# ---------------------------------------------------------------------------
section "7. NETWORK SECURITY"

# DNS configuration
info "DNS Servers configured:"
scutil --dns 2>/dev/null | grep "nameserver" | sort -u | head -10 | while read -r line; do
    info "  $line"
done

# Check for captive portal
CAPTIVE=$(defaults read /Library/Preferences/SystemConfiguration/com.apple.captive.control Active 2>/dev/null || echo "unknown")
if [[ "$CAPTIVE" == "0" ]]; then
    pass "Captive portal assistant is disabled (prevents MITM via hotspot pages)"
else
    warn "Captive portal assistant is active — can be used for MITM; consider disabling"
fi

# Wi-Fi auto-join for open networks
info "Review Wi-Fi auto-join settings: networksetup -listpreferredwirelessnetworks en0"

# Active network connections
info "Open network connections (top 15):"
lsof -i -P -n 2>/dev/null | grep ESTABLISHED | head -15 | while read -r line; do
    info "  $line"
done

# Listening ports
info "Listening TCP ports:"
lsof -i -P -n 2>/dev/null | grep LISTEN | while read -r line; do
    info "  $line"
done

# ---------------------------------------------------------------------------
# 8. APPLICATION SECURITY
# ---------------------------------------------------------------------------
section "8. APPLICATION SECURITY"

# Unsigned or ad-hoc signed running apps
info "Checking running applications for unsigned code..."
UNSIGNED_COUNT=0
while IFS= read -r pid; do
    APP_PATH=$(ps -p "$pid" -o comm= 2>/dev/null || true)
    if [[ -n "$APP_PATH" ]] && [[ -f "$APP_PATH" ]]; then
        SIG=$(codesign -dv "$APP_PATH" 2>&1 || true)
        if echo "$SIG" | grep -q "code object is not signed"; then
            warn "Unsigned process: PID=$pid $APP_PATH"
            ((UNSIGNED_COUNT++))
        fi
    fi
done < <(ps -eo pid= 2>/dev/null | head -100)
if [[ $UNSIGNED_COUNT -eq 0 ]]; then
    info "No obviously unsigned processes detected in sample"
fi

# Check for known security tools
info "Security tools check:"
for tool in "Little Snitch" "LuLu" "BlockBlock" "KnockKnock" "OverSight" "RansomWhere" "Santa" "Mullvad VPN" "Wireguard" "1Password" "KeePassXC" "Bitwarden"; do
    if ls /Applications/ 2>/dev/null | grep -qi "$tool" || mdfind "kMDItemDisplayName == '$tool'" 2>/dev/null | grep -q .; then
        pass "Found: $tool"
    fi
done

# Check for known potentially unwanted software
info "Checking for known unwanted/risky software..."
for risky in "TeamViewer" "AnyDesk" "LogMeIn" "Zoom Plugin"; do
    if ls /Applications/ 2>/dev/null | grep -qi "$risky"; then
        warn "Found remote access software: $risky — ensure this is authorized"
    fi
done

# ---------------------------------------------------------------------------
# 9. BROWSER EXTENSIONS & PROFILES
# ---------------------------------------------------------------------------
section "9. BROWSER SECURITY"

# Chrome extensions directory
if [[ -d "$HOME/Library/Application Support/Google/Chrome" ]]; then
    CHROME_EXT_COUNT=$(find "$HOME/Library/Application Support/Google/Chrome/Default/Extensions" -maxdepth 1 -type d 2>/dev/null | wc -l)
    info "Chrome extensions installed: ~$((CHROME_EXT_COUNT - 1))"
    warn "Review Chrome extensions manually — malicious extensions are a top attack vector"
fi

# Safari extensions
info "Check Safari extensions: Safari > Settings > Extensions"

# Firefox
if [[ -d "$HOME/Library/Application Support/Firefox" ]]; then
    info "Firefox detected — review add-ons at about:addons"
fi

# ---------------------------------------------------------------------------
# 10. SSH & CREDENTIALS
# ---------------------------------------------------------------------------
section "10. SSH & CREDENTIAL HYGIENE"

# SSH keys
if [[ -d "$HOME/.ssh" ]]; then
    info "SSH directory exists"
    SSH_PERMS=$(stat -f "%Lp" "$HOME/.ssh" 2>/dev/null || echo "unknown")
    if [[ "$SSH_PERMS" == "700" ]]; then
        pass "~/.ssh directory permissions are 700 (correct)"
    else
        fail "~/.ssh directory permissions are $SSH_PERMS — should be 700"
    fi

    # Check key types
    for keyfile in "$HOME/.ssh/"*.pub; do
        if [[ -f "$keyfile" ]]; then
            KEY_TYPE=$(ssh-keygen -lf "$keyfile" 2>/dev/null | awk '{print $4}' || echo "unknown")
            KEY_BITS=$(ssh-keygen -lf "$keyfile" 2>/dev/null | awk '{print $1}' || echo "unknown")
            if [[ "$KEY_TYPE" == "(ED25519)" ]]; then
                pass "SSH key $keyfile uses Ed25519 (strong)"
            elif [[ "$KEY_TYPE" == "(RSA)" ]] && [[ "$KEY_BITS" -ge 4096 ]]; then
                pass "SSH key $keyfile uses RSA-$KEY_BITS (acceptable)"
            elif [[ "$KEY_TYPE" == "(RSA)" ]]; then
                warn "SSH key $keyfile uses RSA-$KEY_BITS — upgrade to Ed25519 or RSA-4096"
            else
                info "SSH key $keyfile: $KEY_BITS $KEY_TYPE"
            fi
        fi
    done

    # Authorized keys
    if [[ -f "$HOME/.ssh/authorized_keys" ]]; then
        AK_COUNT=$(wc -l < "$HOME/.ssh/authorized_keys")
        warn "authorized_keys has $AK_COUNT entries — review for unknown keys"
    fi
else
    info "No ~/.ssh directory found"
fi

# Keychain
info "Keychain items can be reviewed with: security dump-keychain -d (requires auth per item)"

# Environment variables with secrets
info "Checking for secrets in shell profiles..."
for profile in "$HOME/.bash_profile" "$HOME/.bashrc" "$HOME/.zshrc" "$HOME/.zprofile" "$HOME/.profile"; do
    if [[ -f "$profile" ]]; then
        if grep -iE "(API_KEY|SECRET|TOKEN|PASSWORD|PRIVATE_KEY)=" "$profile" 2>/dev/null | grep -v "^#"; then
            warn "Possible secrets found in $profile — use a secrets manager instead"
        fi
    fi
done

# ---------------------------------------------------------------------------
# 11. PERSISTENCE MECHANISMS (malware check)
# ---------------------------------------------------------------------------
section "11. PERSISTENCE MECHANISMS (suspicious items)"

info "Checking LaunchAgents and LaunchDaemons..."

# User LaunchAgents
if [[ -d "$HOME/Library/LaunchAgents" ]]; then
    info "User LaunchAgents:"
    ls "$HOME/Library/LaunchAgents/" 2>/dev/null | while read -r plist; do
        if ! echo "$plist" | grep -qiE "^com\.(apple|google|microsoft|spotify|1password|docker)"; then
            warn "  Non-standard LaunchAgent: $plist — verify this is legitimate"
        else
            info "  $plist"
        fi
    done
fi

# System LaunchAgents
info "System LaunchAgents (non-Apple):"
ls /Library/LaunchAgents/ 2>/dev/null | while read -r plist; do
    if ! echo "$plist" | grep -qiE "^com\.apple\."; then
        warn "  Third-party LaunchAgent: $plist"
    fi
done

# System LaunchDaemons
info "System LaunchDaemons (non-Apple):"
ls /Library/LaunchDaemons/ 2>/dev/null | while read -r plist; do
    if ! echo "$plist" | grep -qiE "^com\.apple\."; then
        warn "  Third-party LaunchDaemon: $plist"
    fi
done

# Login Items
info "Login Items (may require user context):"
osascript -e 'tell application "System Events" to get the name of every login item' 2>/dev/null || info "  Could not enumerate login items"

# Cron jobs
if crontab -l 2>/dev/null | grep -v "^#" | grep -v "^$" > /dev/null 2>&1; then
    warn "Active cron jobs found:"
    crontab -l 2>/dev/null | grep -v "^#" | while read -r line; do
        warn "  $line"
    done
else
    pass "No user cron jobs found"
fi

# Kernel extensions
KEXT_COUNT=$(kextstat 2>/dev/null | grep -cv "com.apple" || echo "0")
if [[ "$KEXT_COUNT" -gt 0 ]]; then
    warn "Non-Apple kernel extensions loaded: $KEXT_COUNT"
    kextstat 2>/dev/null | grep -v "com.apple" | while read -r line; do
        warn "  $line"
    done
else
    pass "No non-Apple kernel extensions loaded"
fi

# ---------------------------------------------------------------------------
# 12. ADVANCED THREAT INDICATORS
# ---------------------------------------------------------------------------
section "12. ADVANCED THREAT INDICATORS"

# Check for TCC.db modifications (privacy permission database)
TCC_USER="$HOME/Library/Application Support/com.apple.TCC/TCC.db"
if [[ -f "$TCC_USER" ]]; then
    TCC_PERMS=$(stat -f "%Lp" "$TCC_USER" 2>/dev/null || echo "unknown")
    info "User TCC.db permissions: $TCC_PERMS"
    TCC_MOD=$(stat -f "%Sm" "$TCC_USER" 2>/dev/null || echo "unknown")
    info "User TCC.db last modified: $TCC_MOD"
fi

# Profiles (MDM, configuration profiles)
PROFILES_OUTPUT=$(profiles list 2>/dev/null || echo "none")
if echo "$PROFILES_OUTPUT" | grep -q "There are no configuration profiles installed"; then
    info "No MDM/configuration profiles installed"
else
    warn "Configuration profiles are installed — review with: sudo profiles list -verbose"
    echo "$PROFILES_OUTPUT" | head -20
fi

# SUID binaries (potential privilege escalation)
info "Non-Apple SUID binaries:"
find /usr/local /opt /Applications -perm -4000 -type f 2>/dev/null | while read -r suid; do
    warn "  SUID binary: $suid"
done

# Check for recently modified system binaries
info "Recently modified files in /usr/local/bin (last 7 days):"
find /usr/local/bin -mtime -7 -type f 2>/dev/null | while read -r f; do
    info "  $f"
done

# ---------------------------------------------------------------------------
# SUMMARY
# ---------------------------------------------------------------------------
section "AUDIT SUMMARY"
echo ""
echo -e "  ${GREEN}Passed:${NC}   $PASS_COUNT"
echo -e "  ${RED}Failed:${NC}   $FAIL_COUNT"
echo -e "  ${YELLOW}Warnings:${NC} $WARN_COUNT"
echo -e "  ${CYAN}Info:${NC}     $INFO_COUNT"
echo ""

if [[ $FAIL_COUNT -eq 0 ]] && [[ $WARN_COUNT -le 3 ]]; then
    echo -e "  ${GREEN}${BOLD}Overall: GOOD — Your Mac is well hardened.${NC}"
elif [[ $FAIL_COUNT -eq 0 ]]; then
    echo -e "  ${YELLOW}${BOLD}Overall: FAIR — No critical failures, but review warnings.${NC}"
else
    echo -e "  ${RED}${BOLD}Overall: ACTION REQUIRED — Fix the FAIL items above.${NC}"
fi

echo ""
echo "  Full audit report saved to: /tmp/macos-security-audit-$(date +%Y%m%d).log"
echo ""
