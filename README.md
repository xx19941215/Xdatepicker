## 简单易用的日期选择器

[DEMO](http://xiaoxiao.work/Xdatepicker/)

类似的日期选择插件实现难点如下

1. 在日历面板如何展示日期
2. 各个日期如何和星期对应上。

这款插件可以在`input`元素上设置自定义的`date-init`属性来设置初始展示日期。`DatePicker`类中有两个变量`date`和`watchDate`
来记录用户设置的`date-init`。一开始两个变量都初始化为对应`date-init`的日期对象。

`watchDate`就是为了解决第一个问题而设置的。以`watchDate`日期对象为基准，获所有的日期信息，构建如下对象数组。
```javascript
[
  {
    type:"prev", //取值类型 可以是 prev(链接上个月最后几天的Date对象) cur（本月所有可选择的Date对象） next(链接下个月前几天的Date对象)
    date:date //日期对象
  },
  ....
]
```
这样，要展示的日期数据就有了。那么各个日期是如何和星期对应上的？
首先以`watchDate`得到该月的第一天和最后一天的Date对象。获得第一天很简单，直接返回`new Date(year,month,1)`就可以，而最后一天也很简单，
先获得下一个月第一天的时间戳，然后减去`1000*60*60*24`，再使用`new Date()`设置就好。这样就可以使用`getDay()`获得第一天和最后一天对应的星期编号(0-6)

因为每一行要显示完成的7天，所以根据第一天和最后一天星期的编号来补上上一个月和下一个月份的那几天。

```javascript
    //存储所有要显示的Date对象的数组
    var dateArr = [];
    //获取上个月的
    for(var i=firstDate.getDay();i>0;i--){
      var date = new Date(firstDate.getTime()-i*1000*60*60*24);
      dateArr.push({
        type:"prev",
        date:date
      })
    }
    //当月的
    for(var j=0;j<dateCounts;j++){
       var date = new Date(firstDate.getTime()+j*1000*60*60*24);
       if(date.getTime() == this.date.getTime()){
          dateArr.push({
            type:"now cur",
            date:date
          });
          continue;
       }
       dateArr.push({
         type:"cur",
         date:date
       });
    }
    //下一个月的
    for(var k = 1;k<7-lastDate.getDay();k++){
       var date = new Date(lastDate.getTime()+k*1000*60*60*24);
       dateArr.push({
         type:"next",
         date:date
       })
    }
```
然后html的处理就很简单了，因为我是用的表格布局。所以每七天加一个`<tr></tr>`即可。
当用户选择下一月的时候，重置`dateWatch`为下一个月的第一天，然后使用同样的方法获取对象数组就行了，上一个月同理。

