# Elizabeth Bot

A bespoke Discord onboarding and application management bot built for **Persona 3 Dual**. 

By replacing our manual systems, it streamlines the entire lifecycle:

* **Higher Application Conversions:** Eliminates friction by hooking directly into Discord's native community onboarding, instantly triggering the application workflow and delivering instructions without requiring manual pings or extra steps from the user.
* **Absolute Privacy:** Replaces public application channels, keeping all user information, feedback, and decisions strictly confidential from the general community.
* **Collaborative Lead Visibility:** Generates dedicated private threads, allowing direct communication with the applicant while ensuring the entire process remains visible and open for discussion among all Team Leads.
* **Seamless Role Compatibility:** Hooks directly into the server's pre-existing role hierarchy—requiring zero structural changes to current permissions or setups.
* **Streamlined Processing:** Provides Team Leads with a fast, intuitive slash-command interfaceto assign roles, deliver updates, and archive tickets without ever leaving the server.

> Want to help? Join the [Discord!](https://discord.gg/CQnkc5gS6a) Any help, big or small, would be greatly appreciated!

![Stars](https://img.shields.io/github/stars/p3d-project/elizabeth-bot?style=flat-square&color=gold)
![Forks](https://img.shields.io/github/forks/p3d-project/elizabeth-bot?style=flat-square&color=blue)
![Last Commit](https://img.shields.io/github/last-commit/p3d-project/elizabeth-bot?style=flat-square&color=green)
![License](https://img.shields.io/badge/license-CC_BY--NC--SA_4.0-red)

![Javascript](https://shields.io/badge/JavaScript-F7DF1E?logo=JavaScript&logoColor=000&style=flat-square)

[![Discord](https://img.shields.io/discord/1498850477545357482?label=Discord&logo=discord&style=flat-square&color=5865F2)](https://discord.gg/CQnkc5gS6a)

## Commands

The bot is entirely driven by Discord slash commands.

### Setup

#### `/set_config`
**Syntax:** `/set_config applicant_role:[@role] team_lead_role:[@role] app_channel:[#channel] form_link:[URL]`
Initializes or updates the bot's core settings. The bot will not function until this command is run.
* **`applicant_role`**: The base role assigned to users while they are actively applying.
* **`team_lead_role`**: The role that will be pinged inside the private thread when a new ticket opens.
* **`app_channel`**: The channel where the bot will spawn the private threads.
* **`form_link`**: The external URL (e.g., Google Form) delivered to the applicant.

### Workflow
All application processing is handled directly inside the applicant's private thread. This replaces the old workflow of announcing approvals and rejections in public channels, keeping the server clean and communication direct.

#### `/approve`
**Syntax:** `/approve user:[@user] role1:[@role] role2:[@role] (optional)`
Approves the applicant and instantly assigns them the specified project role(s). 

#### `/reject`
**Syntax:** `/reject user:[@user] role1:[@role] (optional) role2:[@role] (optional)`
Declines the applicant. 
* **Targeted Rejection:** Specify roles to decline them for specific positions only (useful if you are rejecting them for one role, but approving them for another).
* **Full Rejection:** Leave all role fields blank to automatically decline the application for **all** positions.

#### `/close_ticket`
**Syntax:** `/close_ticket user:[@user]`
Finalizes the application lifecycle and cleans up the server. 
* **When to use:** Execute this command only *after* the approval/rejection has been sent and the applicant has acknowledged the decision. 
* **Action:** Removes the user's base Applicant role and permanently archives and locks the private thread to preserve the historical record.

---

![Alt](https://repobeats.axiom.co/api/embed/004c0d9e829164f16f77d39fb68039eae2a1f557.svg "Repobeats analytics image")

---

## Legal
Elizabeth bot icon image sourced from [MegaTen Wiki]( https://megatenwiki.com/wiki/File:P3_Elizabeth_Artwork.png)
### License
Original work under the MIT License, Copyright (c) 2022 Shay DeWael
The repo is licensed under the Creative Commons **Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0).**

This license means:

- **Attribution (BY)**: You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- **NonCommercial (NC)**: You may not utilize this repo for commercial purposes.
- **ShareAlike (SA)**: If you remix, transform, or build upon the repo, you must distribute your contributions under the same license as the original.

If you want to use the repo in a commercial application, contact thep3dproject@gmail.com for solutions.
