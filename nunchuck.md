---
layout: page
title: Nunchuck to Maya
published: false
---

<style>
  .post-content > p > a > img {
    margin-bottom: 20px;
    width: 100%;
  }
</style>

<em>This article describes a basic setup allowing an Arduino microcontroller board to communicate with Maya via a serial connection.</em>
<strong>Assumptions</strong>

<ol>
<li>You have an <a href="https://web.archive.org/web/20100617042436/http://www.arduino.cc/">Arduino</a> board.</li>
<li>You have successfully uploaded sketches to it.</li>
<li>You have Maya 8.5 or later, and can execute Python scripts from within Maya.</li>
<li>You are running 32-bit Windows.</li>
</ol>

<em>Disclaimer:</em> I only barely understand why this works. If you know how these instructions could be simplified, better generalized, or otherwise improved, please comment.
<strong>Overview</strong>
Since Maya 8.5, Maya has come with an installation of Python &#8212; for Maya 2009, it&#8217;s 2.5.1, and you can run it right in the script editor. The separately-downloadable <a href="https://web.archive.org/web/20100617042436/http://pyserial.sourceforge.net/pyserial.html">pySerial module</a> allows Python scripts to communicate with serial devices such as the Arduino. However, pySerial requires certain files from the <a href="https://web.archive.org/web/20100617042436/http://python.net/crew/mhammond/win32/">Python for Windows extensions</a>, aka PyWin32. PyWin32 apparently requires that a full installation of Python be available, and pySerial requires that the Python install and the PyWin32 files be of the same version number. So, I installed Python 2.5 first, which wrote appropriate registry entries. Then I installed PyWin32 for Python 2.5, noted the paths, and installed pySerial.
After futzing with test scripts to ensure correct installation, I uploaded a sketch to Arduino which wrote &#8220;hello world&#8221; to the serial port, and ran a Python script in Maya which listened, and heard, oh yes.
Details and code follow:<br/>
<span id="more-822"></span><br/>
<strong>Details and code</strong>
I installed the <a href="https://web.archive.org/web/20100617042436/http://pyserial.sourceforge.net/pyserial.html">pySerial Python module</a> by extracting the serial directory to Maya&#8217;s python directory, which for me was <code>C:\Program Files\Autodesk\Maya2009\python</code>. Apparently you can just add the path to the PYTHONPATH Windows environment variable, but when I tried that, it broke Maya&#8217;s script editor, claiming some MEL problem. A likely story.
When trying to &#8220;import serial&#8221; in the Python script editor, it claimed it was missing two files called win32file.pyd and win32con.pyd. These turned out to be available from PyWin32, which I installed, but then the Python script returned a version mismatch &#8212; I had Python 2.1 installed separately from Maya, and apparently PyWin32 checked that install&#8217;s version when installing.
So &#8212; I downloaded Python 2.5 from the <a href="https://web.archive.org/web/20100617042436/http://www.python.org/download/">Python download page</a> and installed it to <code>C:\Program Files\Common Files\Python</code>, because I already had an installation of Python there. Then I re-installed PyWin32, pointing it to the Python 2.5 installation.
That was the setup &#8212; the rest is code.
<strong>Arduino code</strong>
I found this simple Arduino serial test script by <a href="https://web.archive.org/web/20100617042436/http://todbot.com/">Tod Kurt</a> linked to by <a href="https://web.archive.org/web/20100617042436/http://www.postneo.com/2007/01/18/arduino-serial-communication-with-python">Matt Croydon</a> (<a href="https://web.archive.org/web/20100617042436/http://todbot.com/arduino/sketches/serial_hello_world/serial_hello_world.pde">original file here</a>), and uploaded it to my Arduino.
<pre>
/* Serial Hello World
 * -------------------
 * Simple Hello world for serial ports.
 * Print out "Hello world!" and blink pin 13 LED every second.
 *
 * Created 18 October 2006
 * copyleft 2006 Tod E. Kurt <tod@todbot.com>
 * http://todbot.com/
 */

int ledPin = 13;   // select the pin for the LED
int i=0;           // simple counter to show we're doing something

void setup() {
  pinMode(ledPin,OUTPUT);   // declare the LED's pin as output
  Serial.begin(9600);        // connect to the serial port
}

void loop () {
  Serial.print(i++);
  Serial.println(" Hello world!");  // print out a hello
  digitalWrite(ledPin, HIGH);
  delay(500);
  digitalWrite(ledPin, LOW);
  delay(500);
}
</pre>
<strong>Python code</strong>
So the Arduino was talking to the serial port &#8212; getting Maya to listen was harder. I patched together the code below from a bunch of sources, mostly through the tantalizing hints <a href="https://web.archive.org/web/20100617042436/http://danthompsonsblog.blogspot.com/">Dan Thompson</a> left in his post <a href="https://web.archive.org/web/20100617042436/http://danthompsonsblog.blogspot.com/2008/08/maya-python-arduino-servo.html">Maya + Python + Arduino + Servo (Part 1)</a>. He&#8217;s working the other way around, driving servos from Maya, mwa haw haw.
To get the right serial port settings, I went to the Windows Device Manager and found the USB Serial Port, noted the port name, and found the other settings in Properties &gt; Port Settings. The <code>path.append</code> stuff is apparently unusual, but it wouldn&#8217;t work for me without it. I ran this from the script editor (note that you&#8217;ll have to force-quit Maya to get it to stop):
<pre>
### pySerial port listener
import sys
sys.path.append( "C:\Program Files\Common Files\Python\Python25\Lib\site-packages\win32")
import win32file
sys.path.append( "C:\Program Files\Common Files\Python\Python25\Lib\site-packages\win32\lib")
import win32con
import serial

# configure the serial connections
ser = serial.Serial(
  port='COM3',
  baudrate=9600,
  parity=serial.PARITY_NONE,
  stopbits=serial.STOPBITS_ONE,
  bytesize=serial.EIGHTBITS
)

while 1:
  print ser.readline()
###
</pre>
<strong>The Result</strong>
<object width="425" height="344"><param name="movie" value="http://www.youtube.com/v/zOqGBNW7hHM&amp;hl=en&amp;fs=1&amp;showinfo=0"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="https://web.archive.org/web/20100617042436oe_/http://www.youtube.com/v/zOqGBNW7hHM&amp;hl=en&amp;fs=1&amp;showinfo=0" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="425" height="344"></embed></object>
				