var url = require('url');
var config = require('./config');

var webdriver = require('selenium-webdriver');
var By = require('selenium-webdriver').By;
var until = require('selenium-webdriver').until;

var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();
driver.get(config.loginUrl);
var img = driver.findElement(By.css('img'));
var imgUrl = img.getAttribute('src');
console.log(imgUrl);
