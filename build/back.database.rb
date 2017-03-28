require 'rubygems'
require 'rest-client'
require 'json'
require 'yaml'
require 'optparse'
require 'erb'


# def initialize(opts={})
#
#   opts.each { |k,v| instance_variable_set("@#{k}", v) }
# end

workspace     = ARGV[0]
puts "Workspace = #{workspace}"

def get_items()
  ['bread', 'milk', 'eggs', 'spam']
end

def get_template()
  %{
     #
# Ensure the MySQL gem is defined in your Gemfile
#   gem 'mysql2'
#
# And be sure to use new-style password hashing:
#   http://dev.mysql.com/doc/refman/5.0/en/old-client.html
#
default: &default
  adapter: mysql2
  encoding: utf8
  pool: 5
  username: <%= @username %>
  password: <%= @password %>
  host: <%= @host %>

development:
  <<: *default
  database: <%= @db_name %>_development

# Warning: The database defined as "test" will be erased and
# re-generated from your development database when you run "rake".
# Do not set this db to the same as development or production.
test:
  <<: *default
  database: <%= @db_name %>_test

# As with config/secrets.yml, you never want to store sensitive information,
# like your database password, in your source code. If your source code is
# ever seen by anyone, they now have access to your database.
#
# Instead, provide the password as a unix environment variable when you boot
# the app. Read http://guides.rubyonrails.org/configuring.html#configuring-a-database
# for a full rundown on how to provide these environment variables in a
# production deployment.
#
# On Heroku and other platform providers, you may have a full connection URL
# available as an environment variable. For example:
#
#   DATABASE_URL="mysql2://myuser:mypass@localhost/somedatabase"
#
# You can use this database configuration with:
#
#   production:
#     url: <%= ENV['DATABASE_URL'] %>
#
production:
  <<: *default
  database: <%= @db_name %>_production
  username: <%= @username %>
  password: <%= @password %>

  }
end

class ShoppingList
  include ERB::Util
  attr_accessor :items, :template, :date

  def initialize(items, template, date=Time.now)
    @date = date
    @items = items
    @username = "root"
    @password = "jaclynmarie1"
    @db_name = "sif"
    @host = "127.0.0.1"
    @template = template


  end

  def render()
    ERB.new(@template).result(binding)
  end

  def show_the_html()

    @the_html = render.to_s

    puts @the_html

  end

  def display()

    puts render
  end

  def save(file)
    File.open(file, "w+") do |f|
      f.write(render)
    end
  end

end

list = ShoppingList.new(get_items, get_template)
#list.save('list.html')
list.show_the_html
list.save("#{workspace}/config/database.yml")
#list.display
