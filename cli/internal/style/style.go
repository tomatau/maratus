package style

const ansiReset = "\x1b[0m"

func Blue(s string) string {
	return with("\x1b[34m")(s)
}

func Violet(s string) string {
	return with("\x1b[38;5;183m")(s)
}

func Aqua(s string) string {
	return with("\x1b[36m")(s)
}

func AquaBold(s string) string {
	return with("\x1b[1;36m")(s)
}

func Muted(s string) string {
	return with("\x1b[90m")(s)
}

func Bold(s string) string {
	return with("\x1b[1m")(s)
}

func SoftFlag(s string) string {
	return with("\x1b[38;5;110m")(s)
}

func PromptTitle(s string) string {
	return Violet(s)
}

func PromptFieldLabel(s string) string {
	return Aqua(s)
}

func PromptHint(s string) string {
	return Muted(s)
}

func PromptCursor() string {
	return Aqua("▸ ")
}

func PromptActive(s string) string {
	return Aqua(s)
}

func PromptUnchecked() string {
	return Muted("[ ]")
}

func PromptChecked() string {
	return Violet("[x]")
}

func with(open string) func(string) string {
	return func(s string) string {
		return open + s + ansiReset
	}
}
