module Map
  def self.run(mod_or_proc, arr)
    if arr.class.name == "Array"
      arr.map.with_index do |ele, i|
        Caller.run(mod_or_proc, ele, i)
      end
    else
      arr.map do |key, value|
        Caller.run(mod_or_proc, key, value)
      end
    end
  end
end
