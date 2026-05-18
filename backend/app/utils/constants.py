# Gamification rank progression
RANKS = [
    {"name": "Bronze I", "xp_required": 0, "level_min": 1},
    {"name": "Bronze II", "xp_required": 100, "level_min": 2},
    {"name": "Bronze III", "xp_required": 300, "level_min": 3},
    {"name": "Silver I", "xp_required": 600, "level_min": 4},
    {"name": "Silver II", "xp_required": 1000, "level_min": 5},
    {"name": "Silver III", "xp_required": 1500, "level_min": 6},
    {"name": "Gold I", "xp_required": 2100, "level_min": 7},
    {"name": "Gold II", "xp_required": 2800, "level_min": 8},
    {"name": "Gold III", "xp_required": 3600, "level_min": 9},
    {"name": "Platinum I", "xp_required": 4500, "level_min": 10},
    {"name": "Platinum II", "xp_required": 5500, "level_min": 11},
    {"name": "Platinum III", "xp_required": 6600, "level_min": 12},
    {"name": "Diamond I", "xp_required": 7800, "level_min": 13},
    {"name": "Diamond II", "xp_required": 9100, "level_min": 14},
    {"name": "Diamond III", "xp_required": 10500, "level_min": 15},
]

# XP rewards for various actions
XP_REWARDS = {
    "mission_complete": 50,
    "habit_complete": 10,
    "goal_progress": 25,
    "daily_login": 5,
    "streak_bonus": 100,
}
