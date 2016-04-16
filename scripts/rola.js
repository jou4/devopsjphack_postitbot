module.exports = function(robot){

  var RestClient = require('node-rest-client').Client;
  var jenkins = new RestClient();

  var exec = require('child_process').exec;

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

  robot.respond(/test(.*)/i, function(msg){
    msg.send("param: " + msg.match[1]);
    jenkins.get(getJenkinsApi("api/json"), function(data, response){
      console.log(data);
      data.jobs.forEach(function(val, index, ar){
        msg.send(val.name + ":" + val.url);
      });
    });
  });

  robot.respond(/shell(.*)/i, function(msg){
    msg.send("param: " + msg.match[1]);
    exec('/bin/bash /home/jenkins/tmp/shell/serverspec.sh', function(err, stdout, stderr){
      /* some process */
      console.log(stdout);
      msg.send("done");
      msg.send(stdout);
    });
  });

  robot.respond(/create-vm (.*)/i, function(msg){
    msg.send("create-vm: start: " + msg.match[1]);
    exec('ls -l ./', function(err, stdout, stderr){
      console.log(stdout);
      msg.send("create-vm: finish: " + msg.match[1]);
      msg.send(stdout);
    });
  });

  robot.respond(/(.*)サーバーください|knife/i, function(msg){
    var serverName = msg.match[1];
    msg.send("おっけ～、" + serverName + "サーバー作るからちょっと待っててね♪");
    msg.send(getImageUrl("01"));

    var doing = true;

    var iter = function(){
      if(doing){
        msg.send(serverName + "サーバーはもうちょっとかかるみたい。。。");
        //msg.send(getImageUrl("03"));
        setTimeout(iter, 3000);
      }
    };

    setTimeout(iter, 3000);

    setTimeout(function(){
      //exec('/bin/bash /home/jenkins/tmp/shell/create-vm.sh', function(err, stdout, stderr){
      exec('ls', function(err, stdout, stderr){
        console.log(stdout);
        var ip = "104.45.136.88";
        msg.send(serverName + "サーバーできたよ～♪ : " + ip);
        msg.send(getImageUrl("05"));
        //msg.send(stdout);
        doing = false;
      });
    }, 5000);

/*
    jenkins.get(getJenkinsApi("job/create-vm/build"), function(data, response){
      setTimeout(function(){
        jenkins.get(getJenkinsApi("job/create-vm/api/json"), function(data, response){
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
                msg.send(serverName + "サーバーできたよ～♪ " + targetBuild.url);
                msg.send(getImageUrl("05"));
              }
            });
          };
          setTimeout(iter, 5000);
        });
      }, 10000);
    });
*/
  });

  robot.respond(/(.*)サーバーのテストお願い|serverspec/i, function(msg){
    var serverName = msg.match[1];
    msg.send("おっけ～、" + serverName + "サーバーのテストするね♪");
    msg.send(getImageUrl("07"));

    var doing = true;

    var iter = function(){
      if(doing){
        msg.send(serverName + "サーバーのテストはもうちょっとかかるみたい。。。");
        //msg.send(getImageUrl("04"));
        setTimeout(iter, 3000);
      }
    };

    setTimeout(iter, 3000);

    setTimeout(function(){
      exec('/bin/bash /home/jenkins/tmp/shell/serverspec.sh', function(err, stdout, stderr){
        console.log(stdout);
        msg.send(serverName + "サーバーのテスト終わったよ～♪ ");
        msg.send(getImageUrl("06"));
        //msg.send(stdout);
        doing = false;
      });
    }, 5000);

/*
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
                msg.send(serverName + "サーバーのテスト終わったよ～♪ " + targetBuild.url);
                msg.send(getImageUrl("06"));
              }
            });
          };
          setTimeout(iter, 5000);
        });
      }, 10000);
    });
*/
  });

}
