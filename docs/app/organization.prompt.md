Organize the code as follows.

```yaml
/app: # contains app root
    index.html: # root, imports src
/src: # contains source code
    /model:
        /model.ts: # zod schemas for readings used by the model
    api/
        /readings.ts: requests readings CSV
    /optimize:
        /model.ts: # different data foramt
        /index.ts: # all code related to the optimization problem
    /ui:
        main.tsx: # mounting code

        /components:
            App.tsx: # root component
            /dashboard:
                # ...
            /reusable:
                /common.scss: # common CSS
                ...: # reusable components

            /cost-panel:
                CostPanel.tsx: Imports SCSS
                CostPanel.scss: Only SCSS related to here
            /rate-settings:
                RateSettings.tsx:
                RateSettings.scss:
            /chart:
                ..: # etc
            /usage-chart: # SPLIT usage chart stuff here
            /cost-chart: # SPLIT cost charge here.
```

All chart-related stuff should be in a dedicated Chart component, which ONLY has chart-related things. Other components should have NO chart-related things.

# Modeling

A Reading model should have:

1. Start
2. End
3. Usage

# Important

No error handling
No aborting any HTTP requests

## Charts

One reusable chart component
Then a specific UsageChart component and a speicfic CostChart component
Other components should not define chart-related configuration!
