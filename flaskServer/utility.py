import pgeocode
geo = pgeocode.Nominatim('GB')

from datetime import date

def calculate_age(dob):
    today = date.today()
    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

BADGE_RULES = {
    "first_consult":   lambda u, chats, reviews: chats >= 1,
    "quick_responder": lambda u, chats, reviews: chats >= 1,
    "kind_person":     lambda u, chats, reviews: reviews >= 1,
    "loyal_patient":   lambda u, chats, reviews: chats >= 5,
    "top_reviewer":    lambda u, chats, reviews: reviews >= 3,
    "verified_member": lambda u, chats, reviews: all([u.first_name, u.last_name, u.location, u.bio])
}

def award_badges(user, db):
    from sqlalchemy import text

    chat_count = db.session.execute(
        text("SELECT COUNT(*) FROM chat WHERE sender_id = :id"), {"id": user.id}
    ).scalar() or 0

    review_count = db.session.execute(
        text("SELECT COUNT(*) FROM review WHERE user_id = :id"), {"id": user.id}
    ).scalar() or 0

    earned = list(user.badges) if user.badges else []
    changed = False

    for badge_id, rule in BADGE_RULES.items():
        if badge_id not in earned and rule(user, chat_count, review_count):
            earned.append(badge_id)
            changed = True

    if changed:
        user.badges = earned
        db.session.commit()

    return earned


def get_coordinates(postcode):
    result = geo.query_postal_code(postcode)
    if result.latitude != result.latitude: 
        return None, None
    return result.latitude, result.longitude

def haversine_distance(lat1, lon1, lat2, lon2):
    from math import radians, sin, cos, sqrt, atan2
    R = 6371
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1)*cos(lat2)*sin(dlon/2)**2
    return round(R * 2 * atan2(sqrt(a), sqrt(1-a)), 2)

def distance_between(postcode1, postcode2):
    lat1, lon1 = get_coordinates(postcode1)
    lat2, lon2 = get_coordinates(postcode2)
    if None in (lat1, lon1, lat2, lon2):
        return None
    return haversine_distance(lat1, lon1, lat2, lon2)

