import requests
import urllib.parse

URL = "https://rental-search.bolt.eu/categoriesOverview"
PARAM = {
    "version":"CI.58.0",
    "deviceId":"6696e189-8b25-445c-b167-2d904f569734",
    "deviceType":"iphone",
    "device_name":"iPhone13,2",
    "device_os_version":"iOS15.4.1",
    "language":"en",
    "lat":"59.920413",
    "lng":"10.717425"
}

JSON={
    "phone": "+4791884199",
    "phone_uuid":"6696e189-8b25-445c-b167-2d904f569734",
    "verification" : {
    "confirmation_data" : {
        "code" : "7898"
    }
    }
}

r = requests.get(url=URL, params=PARAM, headers={"Authorization":"Basic KzQ3OTE4ODQxOTk6NjY5NmUxODktOGIyNS00NDVjLWIxNjctMmQ5MDRmNTY5NzM0"})
print(r.text)