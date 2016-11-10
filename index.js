var  mongodb = require('mongodb');
var lineReader = require('line-reader');
var encoding = require("encoding");
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db = new mongodb.Db('test', server, {safe:true});

db.open(function(err, db){
    if(!err){
        console.log('connect successful');
        
        db.createCollection('earthQuack', {safe:true}, function(err, collection){
          if(err){
            console.log(err);
        }else{
            //逐行读取csv文件
            lineReader.eachLine('earthquack.csv', function(oneline, last) {
          
                //console.log(last);
                //做个中文转码避免中文乱码
               var line = encoding.convert(oneline,'utf-8','GB2312').toString('');
               //console.log(line)
               //将csv文件中2015/1/12 格式的时间转化为 20150112
               var time1=line.split(";")[0].split("/")[1];
               var time2=line.split(";")[0].split("/")[2];

            if(time1<10){
                time1='0'+time1;
            }
                
            if(time2<10){
                 time2='0'+time2;
            }
    
             //使用split函数，以,为分隔符分割数据
             var _Date=Number(line.split(";")[0].split("/")[0]+time1+time2);
             //将字符串转化为数字类型
             var Time=line.split(";")[1];
             
             var latitude=Number(line.split(";")[2]);

             var longitude=Number(line.split(";")[3]);

             var deepth=Number(line.split(";")[4]);

             var type=line.split(";")[5];

             var grade=Number(line.split(";")[6]);
             var eventType = line.split(";")[7];
             var address = line.split(";")[8];
             //指定一条记录的格式
             var json ={
                 year:_Date,
                 Time:Time,
                 latitude:latitude,
                 longitude:longitude,
                 deepth:deepth,
                 type:type,
                 grade:grade,
                 eventType:eventType,
                 address:address
                };
        
            collection.insert(json,{safe:true},function(err,result){
                if (err) console.log(err)
                console.log(result)
             });
             if(last == true){
                 console.log('完成~~~~')
             } 
            })
        }
    });
}else{
    console.log(err);
}
});
