#Jobttek V1.0 | Copyright 2016 Apothem S.A. de C.V.
# -*- coding: utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding("utf-8")

import webapp2, jinja2, os, re, random, string, hashlib, json, logging, math 

from datetime import datetime, timedelta, time
from google.appengine.ext import ndb
from google.appengine.api import mail
from python_files import datastore, constants

constants = constants.constants

Usuario = datastore.Usuario

template_dir = os.path.join(os.path.dirname(__file__), 'html_files')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir), autoescape = True)

#--- Decorator functions
def super_user_bouncer(funcion):
	def user_bouncer(self):
		usuario = self.usuario
		if usuario:
			return funcion(self)
		else:
			self.redirect('/SignUpLogIn')
	return user_bouncer

# -- To be deleted
class MainHandler(webapp2.RequestHandler):
    def get(self):
        self.response.write('Hello world!')

#-- Production Handlers
class Handler(webapp2.RequestHandler):
	def write(self, *a, **kw):
		self.response.out.write(*a, **kw)
	
	def render_html(self, template, **kw):
		t = jinja_env.get_template(template)
		usuario = self.usuario 
		if usuario:				
			return t.render(usuario=usuario, **kw)
		else:
			return t.render(**kw)

	def print_html(self, template, **kw):
		self.write(self.render_html(template, constants=constants, **kw))

	def set_secure_cookie(self, cookie_name, cookie_value):
		cookie_secure_value = make_secure_val(cookie_value)
		self.response.headers.add_header('Set-Cookie', '%s=%s; Path=/' % (cookie_name, cookie_secure_value))

	def read_secure_cookie(self, cookie_name):
		cookie_secure_val = self.request.cookies.get(cookie_name)
		return cookie_secure_val and check_secure_val(cookie_secure_val)

	def login(self, usuario):
		self.set_secure_cookie('usuario_id', str(usuario.key.id()))

	def logout(self):
		self.response.headers.add_header('Set-Cookie', 'usuario_id=; Path=/')

	def initialize(self, *a, **kw):
		webapp2.RequestHandler.initialize(self, *a, **kw)
		usuario_id = self.read_secure_cookie('usuario_id')
		self.usuario = usuario_id and Usuario.get_by_usuario_id(int(usuario_id)) #if the user exist, 'self.usuario' will store the actual usuario object


class Home(Handler):
	def get(self):
		self.print_html('Home.html', login_error = False)

			


#--- Validation and security functions ----------
secret = 'apothemvaadominarelmundo'

def make_secure_val(val):
    return '%s|%s' % (val, hashlib.sha256(secret + val).hexdigest())

def check_secure_val(secure_val):
	val = secure_val.split('|')[0]
	if secure_val == make_secure_val(val):
		return val

def make_salt(lenght = 5):
    return ''.join(random.choice(string.letters) for x in range(lenght))

def make_password_hash(email, password, salt = None):
	if not salt:
		salt = make_salt()
	h = hashlib.sha256(email + password + salt).hexdigest()
	return '%s|%s' % (h, salt)

def validate_password(email, password, h):
	salt = h.split('|')[1]
	return h == make_password_hash(email, password, salt)

def user_input_error(post_details):
	for (attribute, value) in post_details.items():
		user_error = input_error(attribute, value)
		if user_error:
			return user_error

	if 'confirm_email' in post_details:
		if post_details['email'] != post_details['confirm_email']:
			return "Emails don't match"

	return None

def input_error(target_attribute, user_input):
	
	validation_attributes = ['first_name',
							 'last_name', 
							 'password',
							 'email']


	if target_attribute not in validation_attributes:
		return None
	
	error_key = target_attribute + '_error' 
		
	if d_RE[target_attribute].match(user_input):
		return None

	else:
		return d_RE[error_key]

d_RE = {'first_name': re.compile(r"^[a-zA-Z0-9_-]{3,20}$"),
		'first_name_error': 'Invalid first name. Your first name most be at least 3 charachers long and cannot contain any special characters.',
		
		'last_name': re.compile(r"^[a-zA-Z0-9_-]{3,20}$"),
		'last_name_error': 'Invalid last name. Your first name most be at least 3 charachers long and cannot contain any special characters.',

		'password': re.compile(r"^.{8,20}$"),
		'password_error': 'Invalid password. Your password most be at least 8 characters long.',
		
		'email': re.compile(r'^[\S]+@[\S]+\.[\S]+$'),
		'email_error': 'Invalid email syntax.'}










app = webapp2.WSGIApplication([
    ('/', Home)
], debug=True)
