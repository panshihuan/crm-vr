function reJson(value,hour){
	if(!value){
		return null;
	}
	var _time = value.split("|")[0];
	var _value = value.replace(_time+"|","");

	if(hour && +new Date() - _time > hour*60*60*1000){
		return null;
	}

	if(_value&&(_value.trim().slice(0,1)=="{"||_value.trim().slice(0,1)=="[")){
		return JSON.parse(_value)
	}
	else if(_value=="null"){
		return null;
	}
	else if(_value=="true"){
		return true;
	}
	else if(_value=="false"){
		return false;
	}
	else{
		return _value
	}
}

function Obj2String(obj){
	var type = Object.prototype.toString.call(obj).slice(8,-1).toUpperCase()
	if(type=="ARRAY"||type=="OBJECT"){
		return JSON.stringify(obj)
	}
	else if(type=="BOOLEAN"){
		if(obj){
			return "true";
		}
		else{
			return "false";
		}
	}
	else{
		return obj
	}
}

export default{
	set(key,value){
		localStorage.setItem(key,(+new Date()+"|")+Obj2String(value))
	},
	get(key,hour){
		return reJson(localStorage.getItem(key),hour)
	},
	clear:function(key){
		localStorage.removeItem(key);
	},
	clearAll:function(){
		localStorage.clear();
	},
	session: {
		set(key,value){
			sessionStorage.setItem(key,(+new Date()+"|")+Obj2String(value))
		},
		get(key,hour){
			return reJson(sessionStorage.getItem(key),hour)
		},
		clear:function(key){
			sessionStorage.removeItem(key);
		},
		clearAll:function(){
			sessionStorage.clear();
		}
	}
}



// LOGINED_USER_INFO 用户信息