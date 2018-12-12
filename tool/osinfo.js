/*
 *	系统信息
 *
 *
 *	@author windroid
 */
var os = require('os');

var arch = os.arch();
var cpus = os.cpus();
var freemem = os.freemem();
var totalmem = os.totalmem();
var uptime = os.uptime();

console.log(arch);
console.log(cpus);
console.log('-');
console.log(freemem);
console.log(totalmem);
console.log(1-freemem/totalmem);

var usercpu = 0;
var syscpu = 0;
var idlecpu = 0;
var irqcpu = 0;
var totalcpu = 0;
for(var x in cpus){
	var t = cpus[x]['times'];

	usercpu += t['user'];
	syscpu += t['sys'];
	idlecpu += t['idle'];
	irqcpu += t['irq'];
	totalcpu += t['user']+t['sys']+t['idle']+t['irq'];
}

console.log('---');
console.log(usercpu);
console.log(syscpu);
console.log(idlecpu);
console.log(irqcpu);
console.log(totalcpu);
console.log(1-idlecpu/totalcpu);
