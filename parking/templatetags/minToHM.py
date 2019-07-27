from django import template

register = template.Library()

@register.filter
def minToHM(total_minutes):
    minutes = total_minutes % 60
    hours = int(float(total_minutes - minutes)/60.0)

    strTime = ''
    if hours == 0:
        strTime = f'{minutes} mins'
    else:
        strTime = f'{hours} hrs {minutes} mins'
    return strTime
