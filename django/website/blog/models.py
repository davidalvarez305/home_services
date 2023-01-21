from django.db import models

class LandingPage(models.Model):
    title = models.CharField(max_length=155)
    description = models.CharField(max_length=255)
    headline = models.TextField()
    content = models.TextField()

    def __str__(self):
        return self.title
