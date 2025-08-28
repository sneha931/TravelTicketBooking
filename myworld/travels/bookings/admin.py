from django.contrib import admin

# Register your models here.
from .models import Bus, Seats
class BusAdmin(admin.ModelAdmin):
    list_display = ('bus_number', 'bus_name', 'start', 'destination')
    

admin.site.register(Bus, BusAdmin)
admin.site.register(Seats)
