class DownloadsController < ApplicationController



  def download
    asg_name = params[:assignment_name]
    csv_file = CSV.generate({}) do |csv|
      arr = DataForCsv::Main.run(asg_name)
      arr.each do |row|
        csv << row
      end
    end
    filename = "#{asg_name}"
    send_data csv_file, :type => 'text/csv; charset=iso-8859-1; header=present', :disposition => "attachment; filename=#{filename}.csv"
  end
end
