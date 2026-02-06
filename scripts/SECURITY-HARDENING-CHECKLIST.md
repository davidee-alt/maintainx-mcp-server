# macOS Security Hardening Checklist

Prioritized by threat impact. Items marked **[CRITICAL]** should be done first.

---

## Tier 1: Non-Negotiable Baseline

These protect against commodity malware, phishing, and opportunistic attacks.

- [ ] **[CRITICAL]** Enable FileVault full-disk encryption
  - System Settings > Privacy & Security > FileVault > Turn On
  - Store recovery key in a **physical safe**, not iCloud
- [ ] **[CRITICAL]** Enable the Firewall + Stealth Mode
  - System Settings > Network > Firewall > Turn On
  - Options > Enable Stealth Mode
- [ ] **[CRITICAL]** Keep macOS and all apps up to date
  - System Settings > General > Software Update > Automatic Updates: all toggles ON
- [ ] **[CRITICAL]** Use a strong, unique login password (16+ characters)
- [ ] **[CRITICAL]** Disable auto-login
  - System Settings > Users & Groups > Automatic Login: Off
- [ ] **[CRITICAL]** Enable screen lock with immediate password
  - System Settings > Lock Screen > Require password: Immediately
- [ ] **[CRITICAL]** Disable Guest account
  - System Settings > Users & Groups > Guest User: Off
- [ ] **[CRITICAL]** Enable SIP (System Integrity Protection)
  - Should be on by default; verify with `csrutil status` in Terminal
- [ ] **[CRITICAL]** Use a password manager (1Password, KeePassXC, or Bitwarden)
  - Never reuse passwords across services

## Tier 2: Serious Hardening

These protect against targeted attacks, network-level threats, and credential theft.

- [ ] Install a network monitor: **LuLu** (free) or **Little Snitch**
  - Alerts you to every outbound connection; blocks unauthorized network access
- [ ] Install **BlockBlock** (free, by Objective-See)
  - Alerts on persistence mechanism installations (LaunchAgents, login items, etc.)
- [ ] Install **OverSight** (free, by Objective-See)
  - Alerts when your mic or camera is activated
- [ ] Use **encrypted DNS** (DNS over HTTPS / DNS over TLS)
  - Options: NextDNS, Quad9 (9.9.9.9), Cloudflare (1.1.1.1)
  - Configure in System Settings > Network > Wi-Fi > Details > DNS
  - Or use the NextDNS / Cloudflare WARP app for system-wide DoH
- [ ] Disable Captive Portal auto-detection
  - `sudo defaults write /Library/Preferences/SystemConfiguration/com.apple.captive.control Active -bool false`
  - Prevents automatic HTTP requests on untrusted networks
- [ ] Disable AirDrop (or set to "Contacts Only")
  - System Settings > General > AirDrop & Handoff
- [ ] Disable Bluetooth when not in use
- [ ] Disable Remote Login (SSH), Screen Sharing, File Sharing, Remote Management
  - System Settings > General > Sharing — turn everything OFF
- [ ] Review browser extensions — remove anything unnecessary
  - Malicious extensions can read all page content including banking sites
- [ ] Enable Safari's "Prevent cross-site tracking" and "Fraudulent website warning"
- [ ] Set SSH keys to Ed25519: `ssh-keygen -t ed25519 -a 100`
- [ ] Set `~/.ssh` permissions to 700, key files to 600
- [ ] Remove secrets from shell profiles (.zshrc, .bashrc) — use a secrets manager

## Tier 3: High-Threat Environment (journalists, activists, executives)

These protect against state-level actors and sophisticated targeted attacks.

- [ ] **Enable Lockdown Mode**
  - System Settings > Privacy & Security > Lockdown Mode > Turn On
  - Disables: JIT compilation, most message attachment types, incoming FaceTime from unknown, shared albums, complex web fonts, some MDM capabilities
  - This is Apple's hardest security posture
- [ ] Use a **hardware security key** (YubiKey 5) for:
  - Apple ID
  - Google/Microsoft accounts
  - GitHub, SSH authentication
  - Password manager master unlock
- [ ] Use a **VPN** on all untrusted networks
  - Recommended: Mullvad VPN (accepts cash/crypto, no account required)
  - WireGuard protocol preferred over OpenVPN
- [ ] Use **separate browsers** for different threat contexts:
  - Browser A (e.g., Firefox + uBlock Origin): daily browsing
  - Browser B (e.g., Safari): banking and sensitive accounts only
  - Browser C (Tor Browser): when anonymity is required
- [ ] Disable Siri and Spotlight Suggestions (sends queries to Apple)
  - System Settings > Siri & Spotlight > disable Siri, disable Spotlight Suggestions
- [ ] Enable **Advanced Data Protection** for iCloud
  - System Settings > Apple ID > iCloud > Advanced Data Protection
  - End-to-end encrypts iCloud backups, photos, notes, etc.
- [ ] Audit LaunchAgents/LaunchDaemons quarterly
  - `ls ~/Library/LaunchAgents/ /Library/LaunchAgents/ /Library/LaunchDaemons/`
  - Use **KnockKnock** (Objective-See) for a thorough scan
- [ ] Consider **Santa** (Google's binary authorization system for macOS)
  - Allowlist mode: only pre-approved binaries can execute
- [ ] Use a **dedicated admin account** separate from your daily-use account
  - Daily account should be Standard, not Administrator
  - Only elevate to admin when installing software
- [ ] Disable automatic Wi-Fi joining for networks you don't recognize
  - `networksetup -listpreferredwirelessnetworks en0`
  - Remove unknown networks: `networksetup -removepreferredwirelessnetwork en0 "NetworkName"`
- [ ] Enable **Find My Mac** + activation lock
  - Protects against physical theft
- [ ] Set firmware password (Intel Macs) or review Recovery mode security (Apple Silicon)

## Tier 4: Operational Security (OpSec)

Behavioral practices — no software can substitute for these.

- [ ] Never open unexpected email attachments, even from known contacts
- [ ] Verify links before clicking — hover to preview the actual URL
- [ ] Use Signal (with disappearing messages) for sensitive communications, not iMessage or SMS
- [ ] Be aware of "shoulder surfing" in public spaces
- [ ] Do not plug in unknown USB devices — ever
  - USB attacks (BadUSB, rubber ducky) can compromise a machine in seconds
- [ ] If you suspect compromise, do NOT continue using the machine
  - Boot into Recovery, run Disk Utility first aid, or wipe and restore
  - Contact a forensic specialist
- [ ] Use separate Apple IDs for work and personal if risk profile demands it
- [ ] Regularly review "Login Items" and "Allow in the Background" in System Settings
- [ ] Cover your webcam with a physical slider when not in use
- [ ] Disable "Hey Siri" and voice dictation
- [ ] For extreme scenarios: use a dedicated air-gapped machine for sensitive operations

## Quick Commands Reference

```bash
# Check SIP status
csrutil status

# Check FileVault status
fdesetup status

# Check Firewall status
/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Enable Firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on

# Enable Stealth Mode
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setstealthmode on

# Disable Captive Portal
sudo defaults write /Library/Preferences/SystemConfiguration/com.apple.captive.control Active -bool false

# List LaunchAgents
ls ~/Library/LaunchAgents/ /Library/LaunchAgents/ /Library/LaunchDaemons/

# List preferred Wi-Fi networks
networksetup -listpreferredwirelessnetworks en0

# Check for listening ports
lsof -i -P -n | grep LISTEN

# Run the audit script
chmod +x scripts/macos-security-audit.sh
sudo ./scripts/macos-security-audit.sh
```

## Recommended Free Tools (all from Objective-See unless noted)

| Tool | Purpose | Link |
|------|---------|------|
| LuLu | Outbound firewall | objective-see.org |
| BlockBlock | Persistence monitor | objective-see.org |
| OverSight | Mic/camera monitor | objective-see.org |
| KnockKnock | Persistence scanner | objective-see.org |
| RansomWhere? | Ransomware detection | objective-see.org |
| Santa | Binary authorization | santa.dev (Google) |
| Mullvad VPN | No-account VPN | mullvad.net |
| NextDNS | Encrypted DNS | nextdns.io |
