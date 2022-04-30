import boto3
from datetime import datetime
from pytz import timezone

# 크롤링 하고자 하는 지하철역 목록 가져오기
def get_object_s3():
    bucket = 's3triggerbuckettest4'

    try:
        s3 = boto3.client('s3', aws_access_key_id='',
                          aws_secret_access_key='')
    except:
        print("boto3 client error", station, category)

    date_time = datetime.now(timezone('Asia/Seoul')).strftime('%Y-%m-%d')

    try:
        station_list = s3.get_object(
            Bucket=bucket,
            Key='{}/play.txt'.format(date_time)
        )
    except:
        print("boto3 get_object error")
    station_decode = station_list["Body"].read().decode('utf-8')
    station_decode_split = station_decode.split(" ")
    return station_decode_split

