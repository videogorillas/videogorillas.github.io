<?php
if ((isset($_POST['name'])) && (strlen(trim($_POST['name'])) > 0)) {
	$name = stripslashes(strip_tags($_POST['name']));
} else {$name = 'No name entered';}
if ((isset($_POST['email'])) && (strlen(trim($_POST['email'])) > 0)) {
	$email = stripslashes(strip_tags($_POST['email']));
} else {$email = 'No email entered';}
if ((isset($_POST['message'])) && (strlen(trim($_POST['message'])) > 0)) {
	$message = stripslashes(strip_tags($_POST['message']));
} else {$message = 'No message entered';}
ob_start();
?>
<html>
<body>
<table style="width: 100%;" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td style="margin: 0; padding: 0;" align="center" valign="top">
<table style="width: 600px;" align="center" bgcolor="#2e2e2e" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td style="margin: 0; padding: 0;" align="left" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td style="padding: 0; margin: 0;" width="100%" bgcolor="#fff" align="center" valign="top"><img src="http://<?php echo $_SERVER['HTTP_HOST']; ?>/email/header.jpg" alt="VideoGorillas" style="display: block;" height="90" width="600" /></td>
</tr>
</tbody>
</table>
<table style="width: 100%;" align="left" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td style="padding-top: 30px; padding-bottom: 14px; padding-left: 50px; padding-right: 0; margin: 0;" align="left" bgcolor="#f5f7f8" valign="top"><span style="font-family: Helvetica Neue, Helvetica, Tahoma, Arial; font-size: 24px; margin: 0; color: #77797b; line-height: 36px; font-weight: 300;">Woo hoo! You got a message!</span></td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td style="margin: 0; padding: 0;" align="left" valign="top">
<table style="width: 100%;" align="left" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td style="padding-top: 0; padding-bottom: 27px; padding-left: 50px; padding-right: 50px; margin: 0;" align="left" bgcolor="#f5f7f8" valign="top">
	<h3 style="font-family: Helvetica Neue, Helvetica, Tahoma, Arial; font-size: 18px; margin: 0; color: #77797b; line-height: 36px; font-weight: 300;">Name</h3>
	<p style="font-family: Helvetica Neue, Helvetica, Tahoma, Arial;font-size:14px;margin:0 0 10px;color:#77797b;"><?=$name;?></p>
	
	<h3 style="font-family: Helvetica Neue, Helvetica, Tahoma, Arial; font-size: 18px; margin: 0; color: #77797b; line-height: 36px; font-weight: 300;">Email</h3>
	<p style="font-family: Helvetica Neue, Helvetica, Tahoma, Arial;font-size:14px;margin:0 0 10px;color:#77797b;"><?=$email;?></p>
	
	<h3 style="font-family: Helvetica Neue, Helvetica, Tahoma, Arial; font-size: 18px; margin: 0; color: #77797b; line-height: 36px; font-weight: 300;">Message</h3>
	<p style="font-family: Helvetica Neue, Helvetica, Tahoma, Arial;font-size:14px;margin:0 0 10px;color:#77797b;"><?=$message;?></p>
	
</td>
</tr>
</tbody>
</table>

<tr>
<td style="margin: 0; padding: 0;" align="left" valign="top">
<table style="width: 100%;" align="left" border="0" cellpadding="0" cellspacing="0">
<tbody>
<tr>
<td style="padding-top: 30px; padding-bottom: 30px; padding-left: 50px; padding-right: 50px; margin: 0;" align="left" bgcolor="#e7e9eb" height="30" valign="top"><span style="font-family: Helvetica Neue, Helvetica, Tahoma, Arial; color: #6d6f70; font-size: 12px;line-height:16px;">You are receiving this notification because you are a member of the VideoGorillas Marketing Team. If you received this message in error, please inform us immediately at info@videogorillas.com.</span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</body>
</html>
<?php
$body = ob_get_contents();
ob_flush();

require("class.phpmailer.php");
$mail = new PHPMailer(true);

try {
	$mail->SMTPDebug = false;
	$mail->do_debug = 0;
	
	$mail->From     = $email;
	$mail->FromName = $name;
	$mail->AddReplyTo($email, $name);
	$mail->AddAddress("jasonbrahms@videogorillas.com","Jason Brahms");
	$mail->AddAddress("jconroy@dsbconsulting.net","John Conroy");
	$mail->IsHTML(true);

	$mail->Subject  =  "Contact Form - VideoGorillas";
	$mail->Body     =  $body;
	$mail->AltBody  =  $message;
	$mail->Send();

	echo 'Message Sent OK';
	} catch (phpmailerException $e) {
	echo $e->errorMessage(); 
	} catch (Exception $e) {
	echo $e->getMessage(); 
}

?>
