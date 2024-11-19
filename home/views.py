from django.shortcuts import render
from .models import Subscriber
from .forms import SubscriberForm

# Create your views here.
def index(request):
    if request.method == 'POST':
        form = SubscriberForm(request.POST)
        if form.is_valid():
            form.save()
            message = "Thanks for subscribing!"
            return render(request, 'home/homepage.html', {'message': message})
    return render(request, "home/homepage.html")
