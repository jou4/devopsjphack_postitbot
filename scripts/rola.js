module.exports = function(robot){

  var RestClient = require('node-rest-client').Client;
  var jenkins = new RestClient();

  function getImageUrl(id){
    var imageName ="rola_" + id + ".jpg";
    var timestamp = (new Date()).toISOString().replace(/[^0-9]/g, "");
    return "https://raw.githubusercontent.com/jou4/devopsjphack_postitbot/master/images/" + imageName + "?" + timestamp;
  }

  function getJenkinsApi(path){
    return "http://13.78.58.239:8080/" + path;
  }

  robot.respond(/apis/i, function(msg){
    jenkins.get(getJenkinsApi("api/json"), function(data, response){
      console.log(data);
      data.jobs.forEach(function(val, index, ar){
        msg.send(val.name + ":" + val.url);
      });
    });
  });

  robot.respond(/サーバーください|knife/i, function(msg){
    msg.send("おっけ～、ちょっと待っててね♪");
    msg.send(getImageUrl("01"));
    jenkins.get(getJenkinsApi("job/knife-azure/build"), function(data, response){
      setTimeout(function(){
        jenkins.get(getJenkinsApi("job/knife-azure/api/json"), function(data, response){
          console.log(data);
          console.log(data.builds);
          var targetBuild = data.builds[0];
          console.log(targetBuild);
          msg.send("もうちょっとかかるみたい。。。 " + targetBuild.url);
          msg.send(getImageUrl("03"));
          var iter = function(){
            jenkins.get(targetBuild.url + "api/json", function(data, response){
              if(data.building){
                msg.send("もうちょっとかかるみたい。。。 " + targetBuild.url);
                setTimeout(iter, 5000);
              }else{
                msg.send("終わったよ～♪ " + targetBuild.url);
                msg.send(getImageUrl("05"));
              }
            });
          };
          setTimeout(iter, 5000);
        });
      }, 10000);
    });
  });

  robot.respond(/テストお願い|serverspec/i, function(msg){
    msg.send("おっけ～、ちょっと待っててね♪");
    msg.send(getImageUrl("07"));
    jenkins.get(getJenkinsApi("job/serverspec/build"), function(data, response){
      setTimeout(function(){
        jenkins.get(getJenkinsApi("job/serverspec/api/json"), function(data, response){
          console.log(data);
          console.log(data.builds);
          var targetBuild = data.builds[0];
          console.log(targetBuild);
          msg.send("もうちょっとかかるみたい。。。 " + targetBuild.url);
          msg.send(getImageUrl("04"));
          var iter = function(){
            jenkins.get(targetBuild.url + "api/json", function(data, response){
              if(data.building){
                msg.send("もうちょっとかかるみたい。。。 " + targetBuild.url);
                setTimeout(iter, 5000);
              }else{
                msg.send("終わったよ～♪ " + targetBuild.url);
                msg.send(getImageUrl("06"));
              }
            });
          };
          setTimeout(iter, 5000);
        });
      }, 10000);
    });
  });

}
