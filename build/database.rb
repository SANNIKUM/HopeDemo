require 'rubygems'
require 'json'
require 'yaml'
require 'optparse'
require 'erb'


# def initialize(opts={})
#
#   opts.each { |k,v| instance_variable_set("@#{k}", v) }
# end

workspace     = ARGV[0]
host = ARGV[1]

puts "Workspace = #{workspace}"
puts "Host = #{host}"

def get_items()
  ['bread', 'milk', 'eggs', 'spam']
end

def get_template()
  %{
    default: &default
      adapter: postgresql
      encoding: unicode
      # For details on connection pooling, see rails configuration guide
      # http://guides.rubyonrails.org/configuring.html#database-pooling
      pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>

    development:
      <<: *default
      host: <%= @host %>
      port: 5432
      database: quarterlycount
      username: quarterlymaster
      password: quarterlycount

      # The specified database role being used to connect to postgres.
      # To create additional roles in postgres see `$ createuser --help`.
      # When left blank, postgres will use the default role. This is
      # the same name as the operating system user that initialized the database.
      #username: qcbackend

      # The password associated with the postgres role (username).
      #password:

      # Connect on a TCP socket. Omitted by default since the client uses a
      # domain socket that doesn't need configuration. Windows does not have
      # domain sockets, so uncomment these lines.
      #host: localhost

      # The TCP port the server listens on. Defaults to 5432.
      # If your server runs on a different port number, change accordingly.
      #port: 5432

      # Schema search path. The server defaults to $user,public
      #schema_search_path: myapp,sharedapp,public

      # Minimum log levels, in increasing order:
      #   debug5, debug4, debug3, debug2, debug1,
      #   log, notice, warning, error, fatal, and panic
      # Defaults to warning.
      #min_messages: notice

    # Warning: The database defined as "test" will be erased and
    # re-generated from your development database when you run "rake".
    # Do not set this db to the same as development or production.
    test:
      <<: *default
      database: qcbackend_test

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
    #   DATABASE_URL="postgres://myuser:mypass@localhost/somedatabase"
    #
    # You can use this database configuration with:
    #
    #   production:
    #     url: <%= ENV['DATABASE_URL'] %>
    #
    production:
      <<: *default
      # remember to also set in heroku config in format postgres://username:password@host/database
      host: <%= @host %>
      port: 5432
      database: quarterlycount
      username: quarterlymaster
      password: quarterlycount


  }
end

class ShoppingList
  include ERB::Util
  attr_accessor :items, :template, :date

  def initialize(host, template)
    #@date = date
    #@items = items
    @username = "root"
    @password = "jaclynmarie1"
    @db_name = "sif"
    @host = host
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

list = ShoppingList.new(host, get_template)
#list.save('list.html')
list.show_the_html
list.save("#{workspace}/config/database.yml")
#list.display
