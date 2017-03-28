module Caller

  def self.run(mod_or_proc, *args)
    if mod_or_proc.class.name == "Module"
      method = mod_or_proc.method(:run)
    else
      method = mod_or_proc
    end

    new_args = args.slice(0, method.arity)
    method.call(*new_args)
  end

end
