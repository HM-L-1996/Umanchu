#!/bin/bash

aws s3 cp s3://projectsparkcode/tools/mysql-connector-java-8.0.28.jar /home/hadoop
sudo pip3 install pandas==1.2.5
sudo pip3 install sklearn
sudo pip3 install requests
sudo pip3 install html_table_parser
sudo pip3 install pymysql
