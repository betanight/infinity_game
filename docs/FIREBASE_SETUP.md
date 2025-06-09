# Firebase Configuration Guide

## Emulator Setup
- Database emulator runs on port 9000
- Configuration in `firebase.json`:
```json
{
  "database": {
    "rules": "firebase/rules.json"
  },
  "emulators": {
    "database": {
      "port": 9000,
      "host": "127.0.0.1"
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  }
}
```

## Security Rules
The working security rules configuration in `firebase/rules.json`:
```json
{
  "rules": {
    "admins": {
      ".read": "auth != null",
      ".write": "auth != null && (root.child('admins').child(auth.uid).val() === true || !data.exists())"
    },
    "characters": {
      ".read": "root.child('admins').child(auth.uid).val() === true",
      ".write": "root.child('admins').child(auth.uid).val() === true",
      "$characterId": {
        ".read": "auth != null && (root.child('admins').child(auth.uid).val() === true || auth.uid === $characterId)",
        ".write": "auth != null && (root.child('admins').child(auth.uid).val() === true || auth.uid === $characterId)"
      }
    },
    "equipment": {
      ".read": "auth != null",
      ".write": "root.child('admins').child(auth.uid).val() === true",
      "$equipmentId": {
        ".read": "auth != null",
        ".write": "root.child('admins').child(auth.uid).val() === true"
      }
    },
    "gameServers": {
      ".read": "auth != null",
      ".write": "root.child('admins').child(auth.uid).val() === true"
    },
    "skills": {
      ".read": "auth != null",
      ".write": "root.child('admins').child(auth.uid).val() === true"
    },
    "template": {
      ".read": "auth != null",
      ".write": "root.child('admins').child(auth.uid).val() === true"
    }
  }
}
```

## Permission Structure
1. **Admins**
   - Stored in `/admins` node
   - Admin status checked via `root.child('admins').child(auth.uid).val() === true`
   - Admins have full read/write access to all collections

2. **Characters**
   - Users can read/write their own characters
   - Admins can read/write all characters
   - Character ownership determined by matching `auth.uid` with `$characterId`

3. **Equipment & Skills**
   - All authenticated users can read
   - Only admins can write/modify

4. **Game Servers**
   - All authenticated users can read
   - Only admins can write/modify

## Running the Emulator
1. Kill any existing Firebase processes:
```bash
pkill -f firebase
```

2. Start the emulator:
```bash
npm run emulator
```

## Troubleshooting
- If port 9000 is in use, check for and kill existing Firebase processes
- Admin access is determined by presence in the `admins` node
- Character access requires matching UID or admin status 