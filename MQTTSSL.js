/*
*   MQTT with SSL - Websockets
*   This is meant to use alonside the HTML/CSS counterpart in the same directory with the name
*   WebConsole.html and WebConsole.css, Notice that WebConsole.html it´s not intended to be a resource to be
*   called but a copy-paste resource.
*
*   Uses MQTT Paho (Websockets).
*   Uses jQuery.
*   Uses a broker from cloudmqtt.com which serves from AWS. The final service by mqttcloud.com offers a free
*     version with up to 5 simultaneous connections and limited transfer speed (but hey! it´s free AND secure,
*     as a reference take mosquitto.org secure ports and see if it´s easier, it´s not).
*   Doesn´t use cookies as the Phone version (in this same directory).
*   Uses an interactive console to send messages and perform commands such as LEDon, LEDoff, shut, con, ...
*
*/

			var usrID;
			var usrCmd;
			var hideWarnings=false;
			var connectionState=false;
			
			function command(usrCmd, usrID){
				
				if(usrID == "$"){
					if(usrCmd === "LEDon" || usrCmd === "LEDoff"){
						if(connectionState === true){
							sendConsoleMsg("LED state updated!","yesMsg");
							MQTTsend(usrCmd);
						}
						else		sendConsoleMsg("No connection. Use 'con' to connect","noMsg");
					}
					else if(usrCmd === "con"){
						try { 		MQTTconnect(); 
									sendConsoleMsg("Conectado!","yesMsg"); }
						catch(e) { 	sendConsoleMsg(e,"noMsg");}
					}
					else if(usrCmd === "client"){
						try { 		MQTTmake(); 
									sendConsoleMsg("Client created. Use 'con' to connect","yesMsg"); }
						catch(e){ 	sendConsoleMsg(e,"noMsg");}
					}
					else if(usrCmd === "shut"){
						try { 		client.disconnect();
									sendConsoleMsg("Disconnected.","yesMsg"); }
						catch(e){ 	sendConsoleMsg(e,"noMsg");}
					}
					else if(usrCmd === "clr"){
						try { 		$("#consoleOutput").text("");
									sendConsoleMsg("Cleared!","yesMsg"); }
						catch(e){ 	sendConsoleMsg(e,"noMsg");}
					}
					else{
						if(connectionState === false ){
							try { 		MQTTconnect(); 
										sendConsoleMsg("Conectado!","yesMsg"); }
							catch(e) { 	sendConsoleMsg(e,"noMsg");}
						}
						else{
							sendConsoleMsg("sent: " + usrCmd);
							if(hideWarnings === false){
								sendConsoleMsg("Warning: intern/extern command not found. Trying to send anyway","warnMsg");
							}
							try { 		MQTTsend(usrCmd); }
							catch(e) { 	sendConsoleMsg(e,"noMsg");}
						}
					}
				}
				else{
					sendConsoleMsg("Incorrect ID","noMsg");
				}
			});
			
			$("#btnHideWarn").click(function(){
				hideWarnings = !hideWarnings;
			)

			
			function sendConsoleMsg(msg, type){
				var outp = $("#consoleOutput");
				var result = "<span style='display:block'" + (type?"class=' consoleMsg " + type + " '>":">") + msg + "</span>"

				outp.append(result);
				outp.scrollTop(outp[0].scrollHeight);
			}



			var host = "tailor.cloudmqtt.com";
			var port = 31345;
			var topic = "t123";
			var MQTTmessage;

			var connectOptions = {
				"timeout":30,
				"userName":"yziinyrs",
				"password":"cgAduprcUNln",
				"onSuccess":onConnect,
				"onFailure":onConnectionLost,
				"useSSL":true
			};

			window.onload = MQTTmake();
			
			function MQTTmake() {
				client = new Paho.MQTT.Client(host, port,topic);
					
				client.onConnectionLost = onConnectionLost;
				client.onMessageArrived = onMessageArrived;

			}
			
			function MQTTconnect(){
				client.connect(connectOptions);
			}
			
			 function MQTTsend(msg) {
				message = new Paho.MQTT.Message(msg);
				message.destinationName = topic;
				client.send(message);
            }
			

			function onConnect() {
				console.log("onConnect: connected!");
				client.subscribe(topic);
				connectionState = true;
			}

			function onConnectionLost(responseObject) {
				console.log("onConnectionLost:"+responseObject.errorMessage);
				connectionState = false;
			}

			function onMessageArrived(message) {
				MQTTmessage = message.payloadString;
				sendConsoleMsg("Response: " + MQTTmessage);
				console.log("onMessageArrived:"+MQTTmessage);
			}
