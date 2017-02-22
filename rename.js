/**
 * batch rename files
 * Depend on json file which marked old name and new name.
 * @author Warren
 * @example node rename ./path/ oldNameKey newNameKey .ext
 */

var fs=require('fs'),
	path=require('path'),
	argvs=process.argv.slice(2);

console.log(argvs);
var list=JSON.parse(fs.readFileSync('list.json')),
	length=list.length,
	pathStr=argvs[0],
	oldNameKey=argvs[1],
	newNameKey=argvs[2],
	ext=argvs[3],
	i,
	oldName='',
	newName='',
	checker=null,
	count={
		done:0,
		success:0,
		failed:0
	};

var rename=function(sn,oldName,newName){
	fs.rename(oldName,newName,function(error){
		count.done+=1;
		if(error){
			count.failed+=1;
			console.error(error);
		}else{
			count.success+=1;
			console.log('['+sn+'/'+length+']',oldName+' <==> '+newName);
		}
	});
}

for(i=0;i<length;i+=1){
	oldName=path.join(pathStr,list[i][oldNameKey]+ext);
	newName=path.join(pathStr,list[i][newNameKey]+ext);
	rename(i+1,oldName,newName);
}

checker=setInterval(function(){
	if(count.done===length){
		if(count.success===length){
			console.log('success!');
		}else{
			console.log(count.success+' files renamed, but '+count.failed+' files rename failed!');
		}
		clearInterval(checker);
		checker=null;
	}
},300);

