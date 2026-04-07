package debug

import (
	"fmt"
	"os"
	"sync/atomic"
)

var enabled atomic.Bool

func SetEnabled(value bool) {
	enabled.Store(value)
}

func Enabled() bool {
	return enabled.Load()
}

func Logf(format string, args ...any) {
	if !enabled.Load() {
		return
	}

	_, _ = fmt.Fprintf(os.Stderr, "[debug] "+format+"\n", args...)
}
