import pointerScroll from '../mixins/pointerScroll'
import typeAheadPointer from '../mixins/typeAheadPointer'
import ajax from '../mixins/ajax'

export default {
    mixins: [pointerScroll, typeAheadPointer, ajax],

    props: {
        /**
         * Contains the currently selected value. Very similar to a
         * `value` attribute on an <input>. You can listen for changes
         * using 'change' event using v-on
         * @type {Object||String||null}
         */
        value: {
            default: null
        },

        /**
         * An array of strings or objects to be used as dropdown choices.
         * If you are using an array of objects, vue-select will look for
         * a `label` key (ex. [{label: 'This is Foo', value: 'foo'}]). A
         * custom label key can be set with the `label` prop.
         * @type {Array}
         */
        options: {
            type: Array,
            default () {
                return []
            },
        },

        /**
         * Disable the entire component.
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            default: false
        },

        /**
         * Can the user clear the selected property?
         * @type {Boolean}
         */
        clearable: {
            type: Boolean,
            default: true
        },

        /**
         * Sets the max-height property on the dropdown list.
         * @deprecated
         * @type {String}
         */
        maxHeight: {
            type: String,
            default: '400px'
        },

        /**
         * Enable/disable filtering the options.
         * @type {Boolean}
         */
        searchable: {
            type: Boolean,
            default: true
        },

        /**
         * Equivalent to the `multiple` attribute on a `<select>` input.
         * @type {Boolean}
         */
        multiple: {
            type: Boolean,
            default: false
        },

        /**
         * Equivalent to the `placeholder` attribute on an `<input>`.
         * @type {String}
         */
        placeholder: {
            type: String,
            default: ''
        },

        /**
         * Sets a Vue transition property on the `.dropdown-menu`. vue-select
         * does not include CSS for transitions, you'll need to add them yourself.
         * @type {String}
         */
        transition: {
            type: String,
            default: 'fade'
        },

        /**
         * Enables/disables clearing the search text when an option is selected.
         * @type {Boolean}
         */
        clearSearchOnSelect: {
            type: Boolean,
            default: true
        },

        /**
         * Close a dropdown when an option is chosen. Set to false to keep the dropdown
         * open (useful when combined with multi-select, for example)
         * @type {Boolean}
         */
        closeOnSelect: {
            type: Boolean,
            default: true
        },

        /**
         * Tells vue-select what key to use when generating option
         * labels when each `option` is an object.
         * @type {String}
         */
        label: {
            type: String,
            default: 'label'
        },

        /**
         * Tells vue-select what key to use when generating option
         * values when each `option` is an object.
         * @type {String}
         */
        valueAs: {
            type: String,
            default: null
        },

        /**
         * Callback to generate the label text. If {option}
         * is an object, returns option[this.label] by default.
         * @type {Function}
         * @param  {Object || String} option
         * @return {String}
         */
        getOptionLabel: {
            type: Function,
            default (option) {
                if (typeof option === 'object') {
                    if (!option.hasOwnProperty(this.label)) {
                        return console.warn(
                            `[vue-select warn]: Label key "option.${this.label}" does not` +
                            ` exist in options object ${JSON.stringify(option)}.\n` +
                            'http://sagalbot.github.io/vue-select/#ex-labels'
                        )
                    }
                    if (this.label && option[this.label]) {
                        return option[this.label]
                    }
                }
                return option;
            }
        },

        /**
         * An optional callback function that is called each time the selected
         * value(s) change. When integrating with Vuex, use this callback to trigger
         * an action, rather than using :value.sync to retreive the selected value.
         * @type {Function}
         * @param {Object || String} val
         */
        onChange: {
            type: Function,
            default: function (val) {
                let applyValue = val
                if (this.multiple && typeof val === 'object' && this.valueAs) {
                    applyValue = Array.isArray(val) ? val.map(item => item ? item[this.valueAs] : null) : [] // val ? val[this.valueAs] : null
                } else if (typeof val === 'object' && this.valueAs) {
                    applyValue = val ? val[this.valueAs] : null
                }
                this.$emit('input', applyValue)
            }
        },

        /**
         * Enable/disable creating options from searchInput.
         * @type {Boolean}
         */
        taggable: {
            type: Boolean,
            default: false
        },

        /**
         * Set the tabindex for the input field.
         * @type {Number}
         */
        tabindex: {
            type: Number,
            default: null
        },

        /**
         * When true, newly created tags will be added to
         * the options list.
         * @type {Boolean}
         */
        pushTags: {
            type: Boolean,
            default: false
        },

        /**
         * When true, existing options will be filtered
         * by the search text. Should not be used in conjunction
         * with taggable.
         * @type {Boolean}
         */
        filterable: {
            type: Boolean,
            default: true
        },

        /**
         * Callback to determine if the provided option should
         * match the current search text. Used to determine
         * if the option should be displayed.
         * @type   {Function}
         * @param  {Object || String} option
         * @param  {String} label
         * @param  {String} search
         * @return {Boolean}
         */
        filterBy: {
            type: Function,
            default (option, label, search) {
                return (label || '').toLowerCase().indexOf(search.toLowerCase()) > -1
            }
        },

        /**
         * Callback to filter results when search text
         * is provided. Default implementation loops
         * each option, and returns the result of
         * this.filterBy.
         * @type   {Function}
         * @param  {Array} list of options
         * @param  {String} search text
         * @param  {Object} vSelect instance
         * @return {Boolean}
         */
        filter: {
            "type": Function,
            default (options, search) {
                return options.filter((option) => {
                    let label = this.getOptionLabel(option)
                    if (typeof label === 'number') {
                        label = label.toString()
                    }
                    return this.filterBy(option, label, search)
                });
            }
        },

        /**
         * User defined function for adding Options
         * @type {Function}
         */
        createOption: {
            type: Function,
            default (newOption) {
                if (typeof this.mutableOptions[0] === 'object') {
                    newOption = {
                        [this.label]: newOption
                    }
                }
                this.$emit('option:created', newOption)
                return newOption
            }
        },

        /**
         * When false, updating the options will not reset the select value
         * @type {Boolean}
         */
        resetOnOptionsChange: {
            type: Boolean,
            default: false
        },

        /**
         * Disable the dropdown entirely.
         * @type {Boolean}
         */
        noDrop: {
            type: Boolean,
            default: false
        },

        /**
         * Sets the id of the input element.
         * @type {String}
         * @default {null}
         */
        inputId: {
            type: String
        },

        /**
         * Sets RTL support. Accepts 'ltr', 'rtl', 'auto'.
         * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir
         * @type {String}
         * @default 'auto'
         */
        dir: {
            type: String,
            default: 'auto'
        },
    },

    data() {
        return {
            search: '',
            open: false,
            mutableValue: null,
            mutableOptions: []
        }
    },

    watch: {
        /**
         * When the value prop changes, update
         * the internal mutableValue.
         * @param  {mixed} val
         * @return {void}
         */
        value(val) {
            if (this.valueHasChange(val)) {
                this.mutableValue = this.getMultibleValue(val)
            }
        },

        /**
         * Maybe run the onChange callback.
         * @param  {string|object} val
         * @param  {string|object} old
         * @return {void}
         */
        mutableValue(val, old) {
            if (this.multiple) {
                this.onChange ? this.onChange(val) : null
            } else {
                this.onChange && val !== old ? this.onChange(val) : null
            }
        },

        /**
         * When options change, update
         * the internal mutableOptions.
         * @param  {array} val
         * @return {void}
         */
        options(val) {
            this.mutableOptions = val
        },

        /**
         * Maybe reset the mutableValue
         * when mutableOptions change.
         * @return {[type]} [description]
         */
        mutableOptions() {
            if (!this.taggable && this.resetOnOptionsChange) {
                this.mutableValue = this.multiple ? [] : null
            } else {
                this.mutableValue = this.getMultibleValue(this.value)
            }
        },

        /**
         * Always reset the mutableValue when
         * the multiple prop changes.
         * @param  {Boolean} val
         * @return {void}
         */
        multiple(val) {
            this.mutableValue = val ? [] : null
        }
    },

    /**
     * Clone props into mutable values,
     * attach any event listeners.
     */
    created() {
        this.mutableValue = this.getMultibleValue(this.value)
        this.mutableOptions = this.options.slice(0)
        this.mutableLoading = this.loading

        this.$on('option:created', this.maybePushTag)
    },

    methods: {
        valueHasChange(val) {
            if (this.multiple) {
                let compareWith = this.mutableValue
                if (this.valueAs) {
                    compareWith = this.mutableValue.map(item => item[this.valueAs])
                }
                let flag = !Array.isArray(val) || !Array.isArray(compareWith) || val.length !== compareWith.length
                if (!flag) {
                    for (let i = 0; i < val.length; i++) {
                        if (val[i] !== compareWith[i]) {
                            flag = true
                            break
                        }
                    }
                }
                return flag
            }
            return val === this.mutableValue
        },
        getMultibleValue(val) {
            let res = val
            if (this.valueAs && this.multiple) {
                let tmpVal = Array.isArray(val) ? val : []
                res = this.options.filter(item => item && tmpVal.find(i => i === item[this.valueAs]))
            } else if (this.valueAs) {
                res = this.options.find(item => item && item[this.valueAs] === val)
            }
            return res
        },

        /**
         * Select a given option.
         * @param  {Object|String} option
         * @return {void}
         */
        select(option) {
            if (!this.isOptionSelected(option)) {
                if (this.taggable && !this.optionExists(option)) {
                    option = this.createOption(option)
                }

                if (this.multiple && !this.mutableValue) {
                    this.mutableValue = [option]
                } else if (this.multiple) {
                    this.mutableValue.push(option)
                } else {
                    this.mutableValue = option
                }
            }

            this.onAfterSelect(option)
        },

        /**
         * De-select a given option.
         * @param  {Object|String} option
         * @return {void}
         */
        deselect(option) {
            if (this.multiple) {
                let ref = -1
                this.mutableValue.forEach((val) => {
                    if (val === option || typeof val === 'object' && val[this.label] === option[this.label]) {
                        ref = val
                    }
                })
                var index = this.mutableValue.indexOf(ref)
                this.mutableValue.splice(index, 1)
            } else {
                this.mutableValue = null
            }
        },

        /**
         * Clears the currently selected value(s)
         * @return {void}
         */
        clearSelection() {
            this.mutableValue = this.multiple ? [] : null
        },

        /**
         * Called from this.select after each selection.
         * @param  {Object|String} option
         * @return {void}
         */
        onAfterSelect(option) {
            if (this.closeOnSelect) {
                this.open = !this.open
                this.$refs.search.blur()
            }

            if (this.clearSearchOnSelect) {
                this.search = ''
            }
        },

        /**
         * Toggle the visibility of the dropdown menu.
         * @param  {Event} e
         * @return {void}
         */
        toggleDropdown(e) {
            if (e.target === this.$refs.openIndicator || e.target === this.$refs.search || e.target === this.$refs.toggle || e.target === this.$el) {
                if (this.open) {
                    this.$refs.search.blur() // dropdown will close on blur
                } else {
                    if (!this.disabled) {
                        this.open = true
                        this.$refs.search.focus()
                    }
                }
            }
        },

        /**
         * Check if the given option is currently selected.
         * @param  {Object|String}  option
         * @return {Boolean}        True when selected | False otherwise
         */
        isOptionSelected(option) {
            if (this.multiple && this.mutableValue) {
                let selected = false
                this.mutableValue.forEach(opt => {
                    if (typeof opt === 'object' && opt[this.label] === option[this.label]) {
                        selected = true
                    } else if (typeof opt === 'object' && opt[this.label] === option) {
                        selected = true
                    } else if (opt === option) {
                        selected = true
                    }
                })
                return selected
            }

            return this.mutableValue === option
        },

        /**
         * If there is any text in the search input, remove it.
         * Otherwise, blur the search input to close the dropdown.
         * @return {void}
         */
        onEscape() {
            if (!this.search.length) {
                this.$refs.search.blur()
            } else {
                this.search = ''
            }
        },

        /**
         * Close the dropdown on blur.
         * @emits  {search:blur}
         * @return {void}
         */
        onSearchBlur() {
            if (this.clearSearchOnBlur) {
                this.search = ''
            }
            this.open = false
            this.$emit('search:blur')
        },

        /**
         * Open the dropdown on focus.
         * @emits  {search:focus}
         * @return {void}
         */
        onSearchFocus() {
            this.open = true
            this.$emit('search:focus')
        },

        /**
         * Delete the value on Delete keypress when there is no
         * text in the search input, & there's tags to delete
         * @return {this.value}
         */
        maybeDeleteValue() {
            if (!this.$refs.search.value.length && this.mutableValue) {
                return this.multiple ? this.mutableValue.pop() : this.mutableValue = null
            }
        },

        /**
         * Determine if an option exists
         * within this.mutableOptions array.
         *
         * @param  {Object || String} option
         * @return {boolean}
         */
        optionExists(option) {
            let exists = false

            this.mutableOptions.forEach(opt => {
                if (typeof opt === 'object' && opt[this.label] === option) {
                    exists = true
                } else if (opt === option) {
                    exists = true
                }
            })

            return exists
        },

        /**
         * If push-tags is true, push the
         * given option to mutableOptions.
         *
         * @param  {Object || String} option
         * @return {void}
         */
        maybePushTag(option) {
            if (this.pushTags) {
                this.mutableOptions.push(option)
            }
        }
    },

    computed: {

        /**
         * Classes to be output on .dropdown
         * @return {Object}
         */
        dropdownClasses() {
            return {
                open: this.dropdownOpen,
                single: !this.multiple,
                searching: this.searching,
                searchable: this.searchable,
                unsearchable: !this.searchable,
                loading: this.mutableLoading,
                rtl: this.dir === 'rtl',
                disabled: this.disabled
            }
        },

        /**
         * If search text should clear on blur
         * @return {Boolean} True when single and clearSearchOnSelect
         */
        clearSearchOnBlur() {
            return this.clearSearchOnSelect && !this.multiple
        },

        /**
         * Return the current state of the
         * search input
         * @return {Boolean} True if non empty value
         */
        searching() {
            return !!this.search
        },

        /**
         * Return the current state of the
         * dropdown menu.
         * @return {Boolean} True if open
         */
        dropdownOpen() {
            return this.noDrop ? false : this.open && !this.mutableLoading
        },

        /**
         * Return the placeholder string if it's set
         * & there is no value selected.
         * @return {String} Placeholder text
         */
        searchPlaceholder() {
            if (this.isValueEmpty && this.placeholder) {
                return this.placeholder;
            }
        },

        /**
         * The currently displayed options, filtered
         * by the search elements value. If tagging
         * true, the search text will be prepended
         * if it doesn't already exist.
         *
         * @return {array}
         */
        filteredOptions() {
            if (!this.filterable && !this.taggable) {
                return this.mutableOptions.slice()
            }
            let options = this.search.length ? this.filter(this.mutableOptions, this.search, this) : this.mutableOptions;
            if (this.taggable && this.search.length && !this.optionExists(this.search)) {
                options.unshift(this.search)
            }
            return options
        },

        /**
         * Check if there aren't any options selected.
         * @return {Boolean}
         */
        isValueEmpty() {
            if (this.mutableValue) {
                if (typeof this.mutableValue === 'object') {
                    return !Object.keys(this.mutableValue).length
                }
                return !this.mutableValue.length
            }

            return true;
        },

        /**
         * Return the current value in array format.
         * @return {Array}
         */
        valueAsArray() {
            if (this.multiple) {
                return this.mutableValue
            } else if (this.mutableValue) {
                return [].concat(this.mutableValue)
            }

            return []
        },

        /**
         * Determines if the clear button should be displayed.
         * @return {Boolean}
         */
        showClearButton() {
            return !this.multiple && this.clearable && !this.open && this.mutableValue != null
        }
    },

}