# Inventory System

---

## How To Use:
1. Add a location in the "New Location" input.
	*Note: Devices cannot be added without a location*
2. Select the device model and type for the devices in the location
	*Note: Choosing the model and type only gets set to new "Assets" added. A devices model and type can be changed after they are added.*
3. Export the data. This will download a TSV file named: `intentory-<MONTH>-<DAY>-<YEAR>.tsv`.

---

## TSV into Excel

1. Create a blank Excel document
2. Copy the content from the tsv file
3. In cell `A1`, paste the content.
4. Formatting the sheet:
	1. Format: Select entire sheet. Navigate to `Home > Number format`, then select `General`.
	2. Fit: Select entire sheet, Double-click any of the column dividers.
	3. Freeze: Select cell `F3`. Navigate to `View > Freeze Panes`, then select `Freeze Panes`.