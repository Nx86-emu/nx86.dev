# NDX Mod Creation — AI Skill

NDX (N Dynamic X) is the built-in modloader for Nx86, a Switch emulator focused on native recompilation (AArch64 → NxIR → x86_64-v4). Use this skill when creating, packaging, or validating mods for Nx86.

## Rules

- Always include or update `nxmod.toml` at the archive root.
- Never include keys, firmware, game dumps, system blobs, or copyrighted payloads.
- Use `romfs/` overlays for asset and data replacement. ExeFS patches are for executable changes only.
- Set `[target].title_id` to the correct 16-character hex Title ID.
- Set `[target].build_id` for ExeFS mods and cheats.
- Declare `[cache].impact` accurately. Understating it causes Nx86 to run stale compiled output against a patched game.
- Do not generate native binary modules unless the user explicitly asks. If you do, declare `[content].native = true` and `[security].requires_native_code = true`.
- No shell scripts, batch files, or host-executable scripts. NDX has no install hooks.
- Include `README.md` and `LICENSE`.
- Mods must be self-contained. No hardcoded host paths, no assumed network access at install time.
- Package as `.ndx` for Nx86-native mods. Use Eden-compatible folder layouts only when cross-emulator compatibility is the goal.

## Checklist

Before delivering a mod, verify:

- [ ] nxmod.toml exists at the archive root
- [ ] [mod].id set — lowercase letters, digits, underscores only
- [ ] [mod].version set
- [ ] [target].title_id set to correct 16-character hex Title ID
- [ ] [target].build_id set (required for ExeFS mods and cheats)
- [ ] [cache].impact accurately reflects what the mod does
- [ ] [content] fields match what is actually in the package
- [ ] No keys, firmware, game dumps, or system blobs included
- [ ] No shell scripts or host-executable files included
- [ ] No native modules unless explicitly requested and declared
- [ ] README.md included
- [ ] LICENSE included
- [ ] nxmod.toml is at the archive root, not a subdirectory
- [ ] Package imports successfully through Nx86

## Minimal nxmod.toml

```toml
[mod]
id = "my_mod"
name = "My Mod"
version = "1.0.0"
format = "ndx"
author = "Author Name"
description = "One-line description."
license = "Unknown"

[target]
title_id = "0100000000000000"

[content]
romfs = true

[cache]
impact = "runtime-only"
```

## Reference

Full NDX documentation: https://nx86.dev/ndx/index.html
