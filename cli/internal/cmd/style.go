package cmd

const ansiReset = "\x1b[0m"

func styleBlue(s string) string {
	return styleWith("\x1b[34m")(s)
}

func styleViolet(s string) string {
	return styleWith("\x1b[38;5;183m")(s)
}

func styleAqua(s string) string {
	return styleWith("\x1b[36m")(s)
}

func styleAquaBold(s string) string {
	return styleWith("\x1b[1;36m")(s)
}

func styleMuted(s string) string {
	return styleWith("\x1b[90m")(s)
}

func styleBold(s string) string {
	return styleWith("\x1b[1m")(s)
}

func styleSoftFlag(s string) string {
	return styleWith("\x1b[38;5;110m")(s)
}

func styleWith(open string) func(string) string {
	return func(s string) string {
		return open + s + ansiReset
	}
}
