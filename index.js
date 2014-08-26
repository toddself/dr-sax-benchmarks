'use strict';

var DrSax = require('dr-sax');
var md = require('html-md');
var Upndown = require('upndown');
var pdc = require('pdc');
var tomd = require('to-markdown').toMarkdown;
var Benchmark = require('benchmark');

var suite = new Benchmark.Suite('html to markdown');
var testString = '<p>Let me describe a scenario for you: you\'re sitting in a foreign room with some bad fluorescent lighting overhead and a hastily erased white-board in a suit that you probably haven\'t worn since your college graduation/best-friends wedding/grandfather\'s funeral. A random person you\'ve never met rushes into the room and introduces himself, minorly out of breath and says sorry he\'s running late. He pulls a piece of paper out of a folder, gives it a once over and says, &quot;Well, why don\'t you tell me a little about yourself to start.&quot;</p><p><img src="/static/img/interviews.png" alt="Interviewing sucks" /> What level of hell are you? You\'re in the job interview?</p><p>Let\'s face it: interviewing for a new job sucks. I know very few people who enjoy the entire process, and even fewer people who enjoy giving interviews. The problem is that they\'re inevitable awkward: someone has something you want and you\'ve got to show them how awesome you are so that they\'ll give it to you. Even worse I find are interviews at tech companies, not only are you sitting there jumping through random hoops explaining what it means that functions are first-order, but inevitably someone is going to make you write code. Or worse, give you code and make you find the error in it.</p><p>This isn\'t even just for programming jobs though; the entire tech industry is frought with seemingly (for the interviewee) left-field questions that aren\'t about the domain of experience you\'re trying to sell them, and for the interviewer, awash with people who say they\'ve led teams to build applications, where by &quot;team&quot; they mean their cat sat on their lap while they wrote the app at home on the weekends.</p><p>As a company though, how you sift out the talkers from the doers? You ask these left-field questions and watch how the candidates react to them. But, frequently, I feel that we go to far.</p><p>In November of 2010, I was anxiously looking to move to Seattle. My wife and I had just had our first kid, she\'s from Bellingham, and I love the area, and with grandma a two hour drive north there\'s not a lot that two newly minted parents aren\'t going to like about that. Going for a tech interview at a large company (you know, the kinds that are willing to pay relocation from Brooklyn) in the Seattle area usually means you\'re going to one of two places: Amazon or Microsoft.</p><p>So I\'m interviewing at Amazon. The job title is Product Developer, Mobile. (I was a product developer at MTV Networks at the time, in the mobile group, so this isn\'t a stretch.) First part of the interview was with H.R. setting expectations: I\'m going to see four different people from various parts of the group who will quiz me on my knowledge around products, mobile, software programming concepts and project management experience.</p><p>First interviewer comes into the room and after the small talk starts the interview goes like this:</p><blockquote><p>&quot;So, how does your computer make the Amazon homepage appear when you type amazon.com into the location bar of your browser&quot;</p></blockquote><blockquote><p>&quot;Well, you type in amazon.com and it asks the DNS server where amazon.com is located and the DNS server says \'amazon.com is 72.21.194.1, so when you ask for that I\'m going to take you there\'.&quot;</p></blockquote><blockquote><p>&quot;What is DNS?&quot;</p></blockquote><blockquote><p>&quot;It\'s the domain name resolution service.&quot;</p></blockquote><blockquote><p>&quot;What does that mean?&quot;</p></blockquote><blockquote><p>&quot;Computers need some sort of addressing mechanism that allows them to locate themselves over a network, since computers deal with numbers better than words, these addresses are typically conveyed in numbers. Humans are bad with long series of numbers, so we came up with a system to look up the numbers based on some words.&quot;</p></blockquote><blockquote><p>&quot;Yeah, but how does it work?&quot;</p></blockquote><blockquote><p>&quot;What do you mean?&quot;</p></blockquote><blockquote><p>&quot;What does \'your computer asks the DNS server what amazon.com is\' mean? How does the DNS server know that?&quot;</p></blockquote><blockquote><p>&quot;Well, when you register a domain name, you create a bunch of records for it in a DNS server; most typically you create a least one A record which says this IP address answers for this domain name, and you might create some MX records which explain where the mail goes, and some CNAME records to say \'Oh you want that? Look at this instead.\'</p></blockquote><blockquote><p>So you create these records. And in that record is also something saying \'this DNS server is responsible for the authoritative answer for this domain name\'. And DNS servers are created in a hiearchy -- as in there are thirteen servers out there called the root DNS servers. Each of these has a bunch of children servers they answer to, and those children have children, etc -- like a tree. So my computer asks the closest DNS server it knows. If it\'s never head of amazon.com, it asks it\'s parent. And if the parent hasn\'t heard of it, it asks its parent, and so forth until the root server gets asked. The root will know the answer (or will know where to get it) so it\'ll eventually filter back down that chain of command.&quot;</p></blockquote><blockquote><p>&quot;Excellent. OK, so know it knows where amazon.com is. What happens next? What do you mean \'it goes there\'? What goes there? How does it know what to get?&quot;</p></blockquote><p>This line of questioning went on for two hours.</p><p>A two hour explaination of how the DNS system works, how TCP/IP routing works, how the HTTP protocol works, what an HTTP verb is, what HTTP verbs there are, how a load-balancer works, what round-robin DNS is, and so forth.</p><p>Mind you this line of questioning was for a job where I would responsible for the consumer experience of Amazon\'s (then two, maybe three) mobile phone applications would be. A job that distinctly doesn\'t touch this level of networking knowledge.</p><p>Now for some reason I didn\'t get this job. (And by that I mean the next two hours were spent explaining how you\'d program an elevator control system to fairly distribute services across multiple floors, but allow someone paying more rent to have priority over the elevator, but without interrupting a current delivery.) I thought the line of questioning was a little absurd and it probably started to show a little.</p><p>In retrospect, however, this line of questioning makes a little more sense to me. Interviewing someone for a product development position, when their experience is with in-house tools that can\'t be shown (I was responsible for the systems that allows MTV Networks to deliver video to it\'s online partners; the Daily Show going to Hulu and Comcast for On-Demand within two hours of being on air is an excellent example), you have to get creative with your line of questioning; it\'s really about the thought processes I was demonstrating when given a left-field question and the reaction and composition under stress that they were watching.</p>';


suite
  .add('dr sax', function(){
    var drsax = new DrSax();
    drsax.write(testString);
  })
  .add('htmlmd', function(){
    md(testString);
  })
  .add('upndown', function(){
    var und = new Upndown();
    und.convert(testString);
  })
  .add('to-markdown', function(){
    tomd(testString);
  })
  .add('pdc', {
    defer: true,
    fn: function(deferred){
      pdc(testString, 'html', 'markdown', function(){
        deferred.resolve();
      });
    }
  })
  .on('cycle', function(event){
    console.log(String(event.target));
  })
  .on('complete', function(){
    console.log('Fastest is '+ this.filter('fastest').pluck('name'));
  })
  .run({async: true});
