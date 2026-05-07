import pgeocode

geo = pgeocode.Nominatim('GB')

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