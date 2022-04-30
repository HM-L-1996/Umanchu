import boto3
from get_object_s3 import get_object_s3
from navermap_crawling import navermap_play
print('Loading function')

s3 = boto3.client('s3')


def lambda_handler(event, context):
    station_list=get_object_s3()
    print(station_list)
    error_station=""
    for station in station_list:
        if (station != "") or (station !=" "):
            error_station+=navermap_play(station)
    return {
        'message' : error_station
    }