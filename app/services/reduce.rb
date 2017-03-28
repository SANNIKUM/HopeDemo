module Reduce

  def self.run(initial_acc, mod_or_proc, arr)
    arr.reduce(initial_acc) do |acc, ele|
      Caller.run(mod_or_proc, acc, ele)
    end
  end
end
