/**
 * Created by xiaoxiao on 2016/9/2.
 */
function DatePicker($target){
  //初始化当前的日期
  this.init($target);
  //渲染日历模板
  this.render();
  //设置模板里的数据
  this.setDate();
  //绑定事件
  this.bind();
}
DatePicker.prototype = {
  init:function($target){
    this.$target = $target;
    if(this.isValidateDate($target.attr('date-init'))){
      //当前日期或者指定要展示的日期
      this.date = new Date($target.attr('date-init'));
      //用户在切换月份时所看到的日期，初始化为当前的日期
      this.watchDate = new Date($target.attr('date-init'));
    }else {
      this.date = new Date();
      this.watchDate = new Date();
    }
  },
  render:function(){
      var tpl = '<div class="date-picker" style="display: none">'
        +'<div class="header"><i class="caret-left"></i><span class="header-date">2016年5月</span><i class="caret-right"></i></div>'+
        '<table class="panel"><thead><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead>'
        +'<tbody></tbody></table></div>';
      this.$datepicker = $(tpl);
      this.$datepicker.insertAfter(this.$target).css({
        position:'absolute',
        top:this.$target.offset().top + this.$target.height(true),
        left:this.$target.offset().left,
      });
  },
  setDate:function(){
    var firstDate = this.getFirstDay(this.watchDate);
    var lastDate = this.getLastDay(this.watchDate);
    var dateCounts = lastDate.getDate() - firstDate.getDate() + 1;
    //console.log(firstDate.getDay());
    var dateArr = [];
    for(var i=firstDate.getDay();i>0;i--){
      var date = new Date(firstDate.getTime()-i*1000*60*60*24);
      dateArr.push({
        type:"prev",
        date:date
      })
    }
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
    for(var k = 1;k<7-lastDate.getDay();k++){
      var date = new Date(lastDate.getTime()+k*1000*60*60*24);
      dateArr.push({
        type:"next",
        date:date
      })
    }
    //console.log(dateArr);
    var tpl = "";
    $.each(dateArr,function(index,item){
      index = index % 7;
      if(index ==0){
        tpl +="<tr>";
      }
      tpl += "<td class='"+item.type+"'>"+item.date.getDate()+"</td>";
      if(index == 6){
        tpl = tpl+"</tr>"
      }
    })

    this.$datepicker.find('tbody').html("");
    this.$datepicker.find('tbody').append($(tpl));
    this.$datepicker.find(".header-date").html(this.watchDate.getFullYear() + "年" + (this.watchDate.getMonth()+1) + "月");

  },
  bind:function(){
    var self = this;
    self.$datepicker.find(".caret-left").click(function(){
      self.watchDate = self.getPreMonth(self.watchDate);
      self.setDate();
    });
    self.$datepicker.find(".caret-right").click(function(){
      self.watchDate = self.getNextMonth(self.watchDate);
      self.setDate();
    });
    self.$datepicker.delegate("td","click",function(e){
      if($(this).attr("class").indexOf("cur")  != -1){
        //console.log(this);
        //console.log(self.watchDate)
        var year = self.watchDate.getFullYear();
        var month = self.watchDate.getMonth() + 1;
        month = month < 10 ? "0"+month : month;
        var date = this.innerHTML;
        date = date < 10 ? "0" + date : date;
        self.$target.val(year + "/" + month +"/"+date);
        //隐藏
        self.$datepicker.hide();
      }
    })
    //获得焦点显示
    self.$target.click(function(e){
      self.$datepicker.show();
      //阻止冒泡
      e.stopPropagation();
    });
    //点击其他部分隐藏
    self.$datepicker.on("click",function(e){
      e.stopPropagation();
    })
    $(window).on("click",function(){
      self.$datepicker.hide();
    })
  },
  isValidateDate:function(date){
    return new Date(date).toString() != 'Invalid Date';
  },
  //获得该月第一天的时间对象
  getFirstDay:function(date){
    var date = new Date(date);
    var year = date.getFullYear();
    var month = date.getMonth();
    return new Date(year,month,1);
  },
  //获得该月最后一天的时间对象
  getLastDay:function(date){
    var date = new Date(date);
    var year = date.getFullYear();
    var month = date.getMonth();
    month++;
    var nextMonth = new Date(year,month,1);
    return new Date(nextMonth - 1000*60*60*24);
  },
  //获取上月1号的时间对象
  getPreMonth:function(date){
    var year = date.getFullYear();
    var month = date.getMonth()-1;
    if(month == 0){
      year--;
      month = 11;
    }
    return new Date(year,month,1);
  },
  //获取下月一号的时间
  getNextMonth:function(date){
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    if(month == 12){
      year++;
      month = 0;
    }
    return new Date(year,month,1);
  },
};
$.fn.datePicker = function(){
  this.each(function(){
    new DatePicker($(this));
  });
};