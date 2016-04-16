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

  robot.respond(/serverspec/i, function(msg){
    jenkins.get(getJenkinsApi("job/serverspec/build"), function(data, response){
      msg.send("start");
      jenkins.get(getJenkinsApi("job/serverspec/api/json"), function(data, response){
        console.log(data);
        console.log(data.builds);
        var targetBuild = data.builds[0];
        console.log(targetBuild);
        msg.send("building: " + targetBuild.url);
        var iter = function(){
          jenkins.get(targetBuild.url, function(data, response){
            if(data.building){
              msg.send("building: " + targetBuild.url);
              setTimeout(iter, 1000);
            }else{
              msg.send("finish : " + targetBuild.url);
            }
          });
        };
        setTimeout(iter, 1000);
      });
    });
  });

  robot.respond(/サーバーください/i, function(msg){
    msg.send("おっけ～、ちょっと待っててね♪");
    msg.send(getImageUrl("02"));
  });

}
