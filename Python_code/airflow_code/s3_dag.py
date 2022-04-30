from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.dummy_operator import DummyOperator
from airflow.contrib.operators.ssh_operator import SSHOperator
from airflow.contrib.hooks.ssh_hook import SSHHook

from station_addr import station_addr
import time
from datetime import datetime
from pytz import timezone
from s3_trigger import s3_station_upload, s3_station
from s3_dic import s3_dic

default_args = {
  'start_date': datetime(2022, 4, 20),
}
play_bash_command = """
spark-submit --master yarn --deploy-mode cluster --jars mysql-connector-java-8.0.28.jar --driver-class-path mysql-connector-java-8.0.28.jar --conf spark.executor.extraClassPath=mysql-connector-java-8.0.28.jar --conf spark.yarn.appMasterEnv.LANG=ko_KR.UTF-8 --executor-memory 12G --executor-cores 4 --driver-memory 7G --driver-cores 1 play.py
"""
food_bash_command = """
spark-submit --master yarn --deploy-mode cluster --jars mysql-connector-java-8.0.28.jar --driver-class-path mysql-connector-java-8.0.28.jar --conf spark.executor.extraClassPath=mysql-connector-java-8.0.28.jar --conf spark.yarn.appMasterEnv.LANG=ko_KR.UTF-8 --executor-memory 12G --executor-cores 4 --driver-memory 7G --driver-cores 1 food.py
"""
def s3_main():
    print(datetime.now(timezone('Asia/Seoul')).strftime('%Y-%m-%d %H:%M'))
    s3_station_upload(s3_station(), 'food')
    time.sleep(300)
    s3_dic("food")
    print(datetime.now(timezone('Asia/Seoul')).strftime('%Y-%m-%d %H:%M'))
    s3_station_upload(s3_station(), 'play')
    time.sleep(300)
    s3_dic("play")
    print(datetime.now(timezone('Asia/Seoul')).strftime('%Y-%m-%d %H:%M'))
def station_():
    station_addr()
hook = SSHHook(
    ssh_conn_id='ssh_default',
    remote_host='',
    username='hadoop',
    key_file='/var/lib/airflow/final.pem'
)
with DAG(dag_id='s3_dag',
         schedule_interval='@daily',
         default_args=default_args,
         tags=['s3_trigger'],
         catchup=False) as dag:

    first_job = DummyOperator(
        task_id='first_job',
    )
    station_addr_insert = PythonOperator(
        task_id='station_addr_insert',
        python_callable =station_
    )
    second_job = DummyOperator(
        task_id='second_job',
    )
    s3_trigger = PythonOperator(
        task_id='s3_trigger',
        python_callable=s3_main
    )
    third_job = DummyOperator(
        task_id='third_job',
    )
    play_submit = SSHOperator(
        task_id='spark_submit_task_play',
        ssh_hook=hook,
        command=play_bash_command
    )
    fourth_job = DummyOperator(
        task_id='fourth_job',
    )
    food_submit = SSHOperator(
        task_id='spark_submit_task_food',
        ssh_hook=hook,
        command=food_bash_command
    )
    first_job >> station_addr_insert >> second_job >> s3_trigger >> third_job >> play_submit >> fourth_job >> food_submit
