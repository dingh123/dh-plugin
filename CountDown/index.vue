<template>
    <div>
        <slot
            :days="timeData.days"
            :hours="timeData.hours"
            :minutes="timeData.minutes"
            :seconds="timeData.seconds"
            :milliseconds="timeData.milliseconds"
        >
            {{ formattedTime }}
        </slot>
    </div>
</template>

<script>
import { raf, cancelRaf } from './raf.js';
export default {
    props: {
        millisecond: Boolean,
        time: {
            type: [Number, String],
            default: 0,
        },
        format: {
            type: String,
            default: 'HH:mm:ss',
        },
        autoStart: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            remain: 0,
            keepAlivePaused: false,
        };
    },

    computed: {
        timeData() {
            return this.parseTimeData(this.remain);
        },

        formattedTime() {
            return this.parseFormat(this.format, this.timeData);
        },
    },
    watch: {
        time: {
            immediate: true,
            handler: 'reset',
        },
    },

    beforeDestroy() {
        this.pause();
    },
    methods: {
        // @exposed-api
        start() {
            if (this.counting) {
                return;
            }

            this.counting = true;
            this.endTime = Date.now() + this.remain;
            this.tick();
        },

        // @exposed-api
        pause() {
            this.counting = false;
            cancelRaf(this.rafId);
        },

        // @exposed-api
        reset() {
            this.pause();
            this.remain = +this.time;

            if (this.autoStart) {
                this.start();
            }
        },

        tick() {
            if (this.millisecond) {
                this.microTick();
            } else {
                this.macroTick();
            }
        },

        microTick() {
            this.rafId = raf(() => {
                /* istanbul ignore if */
                // in case of call reset immediately after finish
                if (!this.counting) {
                    return;
                }

                this.setRemain(this.getRemain());

                if (this.remain > 0) {
                    this.microTick();
                }
            });
        },

        macroTick() {
            this.rafId = raf(() => {
                /* istanbul ignore if */
                // in case of call reset immediately after finish
                if (!this.counting) {
                    return;
                }

                const remain = this.getRemain();
                function isSameSecond(time1, time2) {
                    return Math.floor(time1 / 1000) === Math.floor(time2 / 1000);
                }
                if (!isSameSecond(remain, this.remain) || remain === 0) {
                    this.setRemain(remain);
                }

                if (this.remain > 0) {
                    this.macroTick();
                }
            });
        },

        getRemain() {
            return Math.max(this.endTime - Date.now(), 0);
        },

        setRemain(remain) {
            this.remain = remain;
            this.$emit('change', this.timeData);

            if (remain === 0) {
                this.pause();
                this.$emit('finish');
            }
        },
        padZero(num, targetLength = 2) {
            let str = num + '';

            while (str.length < targetLength) {
                str = '0' + str;
            }

            return str;
        },
        parseTimeData(time) {
            const SECOND = 1000;
            const MINUTE = 60 * SECOND;
            const HOUR = 60 * MINUTE;
            const DAY = 24 * HOUR;
            const days = Math.floor(time / DAY);
            const hours = Math.floor((time % DAY) / HOUR);
            const minutes = Math.floor((time % HOUR) / MINUTE);
            const seconds = Math.floor((time % MINUTE) / SECOND);
            const milliseconds = Math.floor(time % SECOND);

            return {
                days,
                hours,
                minutes,
                seconds,
                milliseconds,
            };
        },
        parseFormat(format, timeData) {
            const { days } = timeData;
            let { hours, minutes, seconds, milliseconds } = timeData;

            if (format.indexOf('DD') === -1) {
                hours += days * 24;
            } else {
                format = format.replace('DD', this.padZero(days));
            }

            if (format.indexOf('HH') === -1) {
                minutes += hours * 60;
            } else {
                format = format.replace('HH', this.padZero(hours));
            }

            if (format.indexOf('mm') === -1) {
                seconds += minutes * 60;
            } else {
                format = format.replace('mm', this.padZero(minutes));
            }

            if (format.indexOf('ss') === -1) {
                milliseconds += seconds * 1000;
            } else {
                format = format.replace('ss', this.padZero(seconds));
            }

            if (format.indexOf('S') !== -1) {
                const ms = this.padZero(milliseconds, 3);

                if (format.indexOf('SSS') !== -1) {
                    format = format.replace('SSS', ms);
                } else if (format.indexOf('SS') !== -1) {
                    format = format.replace('SS', ms.slice(0, 2));
                } else {
                    format = format.replace('S', ms.charAt(0));
                }
            }

            return format;
        },
    },
};
</script>
