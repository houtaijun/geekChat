var block = false;
window.onload = function() {
	var socket = io.connect();

	socket.on('connect',function(){
 		var dialog = new auiDialog({});
		dialog.prompt({
                    title:"请输入您的名字",
                    text:'',
                    buttons:['取消','确定']
                },function(ret){
                    if(ret.buttonIndex == 2){
                        if(!ret.text)
			   ret.text = '匿名';
			 socket.emit('join',ret.text);
			 var nickname = ret.text;
                    }
                })
		//显示聊天窗口
	});

	//监听广播
	socket.on('announcement',function (msg){
		var div = document.createElement('div');
		div.className = "aui-chat-item aui-chat-left";
		div.innerHTML = '<div class="aui-chat-media">\
            <img src="http://image.tiaozaoj.com/default.jpg" />\
        </div>\
        <div class="aui-chat-inner">\
            <div class="aui-chat-name">系统通知</div>\
            <div class="aui-chat-content">\
                <div class="aui-chat-arrow"></div>\
                '+msg+'\
            </div>\
    </div>';
		document.getElementById('header').appendChild(div);
		document.getElementById("dialog").scrollIntoView(true);
	});

	function addMessage(from,text){
		var div = document.createElement('div');
		if(from == '我')
			div.className = "aui-chat-item aui-chat-right";
		else
			div.className = "aui-chat-item aui-chat-left";
		div.innerHTML = '<div class="aui-chat-media">\
            <img src="http://image.tiaozaoj.com/default.jpg" />\
        </div>\
        <div class="aui-chat-inner">\
            <div class="aui-chat-name">'+from+'</div>\
            <div class="aui-chat-content">\
                <div class="aui-chat-arrow"></div>\
                '+text+'\
            </div>\
            </div>';
		document.getElementById('header').appendChild(div);
		document.getElementById("dialog").scrollIntoView(true);

	}


	var input = document.getElementById('message');
        input.oninput = function(){
	     if(input.value.length <= 0)
		document.getElementById('send').style.display = 'none';
	     else
		document.getElementById('send').style.display = 'block';
	}
	document.getElementById('send').onclick = function(){
		if(block)
			return false;
		addMessage('我',input.value);
		socket.emit('text',input.value);

		//重置输入框
		input.value = '';
		blcok = false;
		document.getElementById('send').style.display = 'none';
		return false;
	}

	socket.on('text',addMessage);
}
