# HRV

Web app featuring interactive heatmap of real-time, crowdsourced data on community needs and avaliable shelters with integrated NLP for needs magnitude analysis.

![Landing Page](/landing.jpg?raw=true "Landing Page")

Our web application includes a highly accessible, customizeable UI/UX supplemented by a robust backend. We use the Google Maps API to generate a heatmap based on need requests submitted by inhabitants. Our front-end suports the ability to distinguish between shelters and need locations, and can modify the display based on the users intersts. Although our visualization is based off of hurricane Harvey data, courtesy of the Harvey API, our backend is entirely scalable to support any type of natural disaster and/or needs data. 

![Search Functionality](/searching.jpg?raw=true "Search Functionality")

We utilize Aylien's Text Analysis API to process needs requests and assess needs magnitudes. Our algorithm utilizes a weighted combination of sentiment analysis and a topic model for classification to ensure that we capture urgency of needs requests while also only considering relevant catgories. This ensures that the "hot" zones on our map truly reflect areas with great need and not merely densely populated areas which have more need requests. 

![NLP Heatmap](/viewing.jpg?raw=true "NLP Heatmap")
