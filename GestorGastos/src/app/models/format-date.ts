export const FORMAT_DATE = {
    parse: {
      dateInput: 'MM/YYYY',
    },
    display: {
      dateInput: 'MM/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };

  export const FORMAT_DATE_DDMMYYYY = {
    parse: {
      dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
    },
    display: {
      dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
      monthYearLabel: 'MMMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    }
  };