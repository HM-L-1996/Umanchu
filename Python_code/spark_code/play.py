# -*- coding: utf-8 -*-

import pyspark
from pyspark.sql.types import StringType, StructType, StructField
from pyspark.sql import SQLContext
import pyspark.sql.functions as f
import pandas as pd
import json
from ast import literal_eval
from sklearn.feature_extraction.text import CountVectorizer  # 피체 벡터화
from sklearn.metrics.pairwise import cosine_similarity  # 코사인 유사도
import pymysql
import logging
from datetime import datetime
from pytz import timezone
from common import dict_list_0,dict_list_a,station_crawling,find_simi_place

def play():
    try:
        sc = pyspark.SparkContext()
    except:
        sc.stop()
        sc = pyspark.SparkContext()
    sqlContext = SQLContext(sc)
    sqlContext.setConf("spark.sql.autoBroadcastJoinThreshold", "-1")
    # spark DataFrame 구조 지정
    schema = StructType(
        [
            StructField('id', StringType(), False),
            StructField('name', StringType(), False),
            StructField('category', StringType(), False),
            StructField('tel', StringType(), True),
            StructField('addr', StringType(), False),
            StructField('bizhour', StringType(), True),
            StructField('context', StringType(), True),
            StructField('menu', StringType(), True),
            StructField('reviewcount', StringType(), True),
            StructField('microreview', StringType(), True),
            StructField('thumbnail', StringType(), True),
            StructField('lat', StringType(), True),
            StructField('lng', StringType(), True),
            StructField('ranking', StringType(), True),
            StructField('category_1', StringType(), False),
            StructField('category_2', StringType(), True),
        ]
    )

    dict = {
        '카페/놀거리': ['보드카페', '애견카페', '방탈출', '만화카페'],
        '스포츠/오락': ['볼링', '스크린야구'],
        '노래방': ['노래방'],
        '당구장': ['당구장'],
        'pc방': ['pc방'],
        '오락실': ['오락실'],
        '찜질방': ['찜질방'],
        '놀이공원': ['놀이공원'],
        '영화관': ['영화관']
    }

    # 2차 딕셔너리 category_3 지정
    dict_2 = {
        '찜질방': {
        '목욕탕,사우나': ['생활,편의', '목욕탕,사우나', '목욕,찜질', '근린공원', '부속시설'],
        '레저,테마': ['레저,테마', '워터파크', '좌훈,족욕,좌욕', '마사지,지압', '헬스장', '피부,체형관리'],
        '기타': ['스포츠시설', '쇼핑,유통', '종합도소매', '스포츠,오락', '노래방', '게스트하우스', '식료품',
               '미용', '다이어트,비만', '도로시설', '방면정보', '숙박', '호텔', '제조업', '건강기능식품제조']
    },

        '오락실': {
            '오락실': ['스포츠,오락', '오락시설', '게임', '볼링장', '보드카페'],
            '노래방': ['노래방'],
            '기타': ['영상게임기제조', '기업', '프랜차이즈본사', '기타건축자재',
                   '쇼핑,유통', '술집', '바(BAR)', '패션',
                   '게임유통', '음식점', '퓨전음식', '제조업', '마그네틱,광학매체제조']
        },

        '영화관': {
            '문화,예술': ['문화,예술', '복합문화공간'],
            'DVD방': ['DVD방', '스포츠,오락'],
            '장소대여': ['장소대여', '서비스,산업', '임대,대여', '룸카페'],
            '기타': ['영상,음향기기제조', '제조업', '음식점', '카페,디저트', '블랙박스', '화장실', '전문,기술서비스', '인테리어디자인', '인쇄업', '종합도소매', 'IT서비스',
                   '아울렛', '카달로그인쇄', '서비스,산업', '쇼핑,유통', '쇼핑센터,할인매장']
        },

        '당구장': {
            '당구장': ['스포츠,오락', '무역', '생활용품', '국민체육진흥공단'],
            '당구용품': ['쇼핑,유통', '당구용품'],
            '기타': ['생활체육', '협회,단체', '노래방', '볼링장', '문화,예술', '복합문화공간']
        },
        '놀이공원': {
            '테마파크': ['부속건물', '테마파크', '도시,테마공원', '근린공원', '부속시설'],
            '레저,테마': ['레저,테마', '여행,명소'],
            '기타': ['축구장', '스포츠시설', '박물관', '서비스,산업', '기업', '스포츠,오락', '풋살장', '테니스장', '배드민턴장', '게이트볼장', '스크린골프장', '당구장', '야구장',
                   '도로시설', '방면정보']
        },

        '노래방': {
            '노래방': ['스포츠,오락'],
            '오락시설': ['오락시설'],
            '영상,음향가전': ['영상,음향가전'],
            '단란주점': ['술집', '단란주점'],
            '기타': ['요리주점', '쇼핑,유통', '모텔', '숙박', '소프트웨어개발', '솔루션개발', '']
        },

        'pc방': {
            'PC방': ['스포츠,오락', 'PC방',
                    '인테리어디자인', '오락시설', '컴퓨터프로그래밍,정보서비스업', '시스템,네트워크'],
            '장소대여': ['장소대여', '서비스,산업', '임대,대여', '룸카페', '플레이스테이션방'],
            '기타': ['노래방', '종합도소매', '협회,단체', '컴퓨터,인터넷', '건설업', '배관,냉난방공사', '광고,마케팅', '기업',
                   '전문,기술서비스', '제조업', '컴퓨터,모니터',
                   '컴퓨터모니터제조', '경영컨설팅', '가구', '엔터테인먼트', '모델 에이전시'
                                                        '가공식품', '사무용가구', '소프트웨어개발', '가상현실', '쇼핑,유통', 'CCTV']
        },
        '카페/놀거리': {'보드카페': ['보드카페'], '애견카페': ['애견카페'], '방탈출': ['방탈출'], '만화카페': ['만화카페']},
        '스포츠/오락': {'볼링': ['볼링'], '스크린야구': ['스크린야구']}}
    # Data Loads

    categories = ['노래방', '영화관', '보드카페', '방탈출', '당구장', '만화카페', 'pc방', '스크린야구', '오락실', '볼링', '애견카페', '찜질방', '놀이공원']
    for station in station_crawling():
        # DB 연결 및 테이블 삭제 및 생성
        print(station)
        host = ''
        port = 3306
        username = ''
        database = ''
        password = ''
        conn = pymysql.connect(host=host, user=username, passwd=password, db=database, port=port, charset='utf8mb4',
                               cursorclass=pymysql.cursors.DictCursor)
        cursor = conn.cursor()
        drop_sql = """
        drop table if exists {}_id_info;
        """.format(station)
        cursor.execute(drop_sql)
        conn.commit()
        sql = """
        create table if not exists {}_id_info(
            info_id int auto_increment,
            id int not null,
            name varchar(100) not null,
            tel varchar(15),
            addr varchar(100) not null,
            bizhour varchar(1000),
            context varchar(1000),
            menu varchar(3000),
            reviewcount int not null,
            microreview varchar(3000),
            thumbnail varchar(1000),
            lat double,
            lng double,
            ranking int not null,
            primary key(info_id)
        );
        """.format(station)
        cursor.execute(sql)
        conn.commit()
        sqlCtx = SQLContext(sc)
        df_empty = pd.DataFrame(
            columns=['id', 'name', 'category', 'tel', 'address', 'bizhourInfo', 'context', 'menuInfo', 'reviewCount',
                     'microReview', 'thumUrl', 'y', 'x', 'rank', 'category_1', 'category_2'])

        for category in categories:
            # Data Load
            inputJson = sc.textFile("s3://stationjsondata/play/{}/{}/{}.json".format(
                str(datetime.now(timezone('Asia/Seoul')).strftime('%Y-%m-%d')), station, category)) \
                .map(lambda x: json.loads(x)).collect()
            try:
                for datas in inputJson:
                    json_data = json.loads(datas)
                    js_data = json_data["result"]["place"]["list"]
                    json_df = pd.json_normalize(js_data)
                    df_ = json_df[
                        ['id', 'name', 'category', 'tel', 'address', 'bizhourInfo', 'context', 'menuInfo', 'reviewCount',
                         'microReview', 'thumUrl', 'y', 'x', 'rank']]
                    df_['category_1'] = category
                    df_['category_2'] = df_['category'].map(lambda x: ["'" + k + "'" for k in x if k != category])
                    df_empty = pd.concat([df_empty, df_])
            except:
                continue
        try:
            df_empty1 = df_empty.drop_duplicates(['id'])
            # convert pandas to spark dataframe
            df_ = sqlCtx.createDataFrame(df_empty1, schema)
            # 장소 정보 데이터 sql insert
            df_.select('id', 'name', 'tel', 'addr', 'bizhour', 'context', 'menu', 'reviewcount', 'microreview', 'thumbnail',
                       'lat', 'lng', 'ranking').write.mode("append").format("jdbc") \
                .option("url", "jdbc:mysql://" + host + ":3306/umanchu?useUnicode=true&characterEncoding=UTF-8") \
                .option("driver", "com.mysql.cj.jdbc.Driver").option("dbtable", "{}_id_info".format(str(station))) \
                .option("user", username).option("password", password).save()
            df = sqlCtx.createDataFrame(df_empty, schema)
        except:
            continue
        # ----Data Preprocessing----
        df_new = df.select(
            df.id,
            df.name,
            df.category_1,
            df.category_2,
            df.ranking
        ).cache()

        df_all = df_new.filter(df_new.category_2.isNotNull())
        try:
            df_all = df_all.rdd.map(
                lambda x: (x.id, x.name, dict_list_0(x.category_1, dict), x.category_1, x.category_2, x.ranking)).toDF(
                ['id', 'name', 'category_0', 'category_1', 'category_2', 'ranking'])
        except:
            continue
        targetDf = df_all.withColumn("category_2", \
                                     f.when(df_all["category_1"] == "보드카페", "['보드카페']").otherwise(df_all["category_2"]))
        targetDf = targetDf.withColumn("category_2", \
                                       f.when(targetDf["category_1"] == "애견카페", "['애견카페']").otherwise(
                                           targetDf["category_2"]))
        targetDf = targetDf.withColumn("category_2", \
                                       f.when(targetDf["category_1"] == "방탈출", "['방탈출']").otherwise(targetDf["category_2"]))
        targetDf = targetDf.withColumn("category_2", \
                                       f.when(targetDf["category_1"] == "만화카페", "['만화카페']").otherwise(
                                           targetDf["category_2"]))
        targetDf = targetDf.withColumn("category_2", \
                                       f.when(targetDf["category_1"] == "스크린야구", "['스크린야구']").otherwise(
                                           targetDf["category_2"]))
        targetDf = targetDf.withColumn("category_2", \
                                       f.when(targetDf["category_1"] == "볼링", "['볼링']").otherwise(targetDf["category_2"]))
        targetDf = targetDf.drop(targetDf.category_1)
        targetDf = targetDf.withColumnRenamed('category_0', 'category_1')
        targetDf = targetDf.rdd.map(
            lambda x: (x.id, x.name, str(x.category_1), literal_eval(x.category_2), x.ranking)).toDF(
            ['id', 'name', 'category_1', 'category_2', 'ranking'])

        # -----drop table-----#

        drop_sql = """
        drop table if exists {}_tag;
        """.format(station)
        cursor.execute(drop_sql)
        sql = """
        create table if not exists {}_tag(
            tag_id int not null auto_increment,
            id int not null,
            category1 varchar(10) not null,
            category2 varchar(10) not null,
            score float not null,
            section int not null,
            primary key(tag_id)
        );
        """.format(station)
        cursor.execute(sql)
        conn.commit()
        ######################
        for category in list(dict_2.keys()):
            print(category)
            try:
                targetDf_category = targetDf.filter(targetDf.category_1 == category)
                targetDf_category = targetDf_category.rdd.map(lambda x: (
                x.id, x.name, x.category_1, x.category_2, dict_list_a(x.category_1, x.category_2, dict_2), x.ranking)).toDF(
                    ['id', 'name', 'category_1', 'category_2', 'category_3', 'ranking'])
            except:
                continue
            targetDf_category = targetDf_category.rdd.map(
                lambda x: (
                    x.id, x.name, x.category_1, x.category_2, str(x.category_3),
                    str(str(x.category_3) + " " + str(x.category_2)), x.ranking)
                ).toDF(['id', 'name', 'category_1', 'category_2', 'category_3', 'cate_mix', 'ranking'])
            df_ = targetDf_category.withColumn('cate_mix', f.regexp_replace(f.col('cate_mix'), "\\]", ""))
            df_ = df_.withColumn('cate_mix', f.regexp_replace(f.col('cate_mix'), "\\[", ""))
            df_ = df_.withColumn('cate_mix', f.regexp_replace(f.col('cate_mix'), "\\'", ""))
            # ScikitLearn 모듈 사용을 위한 pandas화
            result = df_.select("*").toPandas()
            result = result.astype({'ranking': 'int'})
            # 문서 집합에서 단어 토큰을 생성하고 각 단어의 수를 최소 빈도 0으로 두고 범위는 (1, 2) 튜플로 둔다
            count_vect_category = CountVectorizer(min_df=0, ngram_range=(1, 2))
            # 하나로 뭉쳐진 카테고리 텍스트 데이터를 피쳐 벡터화함
            place_category = count_vect_category.fit_transform(result['cate_mix'])
            # 카테고리가 서로 얼마나 유사한 지 코사인 유사도 계산
            place_simi_cate = cosine_similarity(place_category, place_category)
            # 유사도 matrix를 인덱스로 내림차순 정렬
            place_simi_cate_sorted_ind = place_simi_cate.argsort()[:, ::-1]

            for k in list(dict_2[category].keys()):
                station_tag_rec = find_simi_place(result, place_simi_cate_sorted_ind, k, 50)

                try:
                    for index, row in station_tag_rec.iterrows():
                        sql = "insert into {}_tag (id,category1,category2,score,section) values({},{},{},{},2)".format(
                            station,
                            int(row['id']),
                            "'" + row['category_1'] + "'",
                            "'" + k + "'",
                            float(row['score'])
                            )

                        cursor.execute(sql)
                except:
                    logging.error("error connection to RDS")
            conn.commit()
        conn.close()
    sc.stop()

play()
