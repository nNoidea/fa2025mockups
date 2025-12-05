---
trigger: always_on
---

# Content language
While creating pages and data for pages etc. go with Dutch instead of English. With this I mean stuff like naming roles etc. Obviously the coding part itself should be in english, but the language of the contents of the apps should be dutch!

# Data
Throughout the project we will be creating our own mock data and you have to import and use them instead of generating new data at random places.

You are allowed to add stuff to the dataset etc. But the main rule here is to always import the dataset instead of creating isolated data pieces, which is not good a at all for consistency.

These datasets are not like databases, we just create typescript objects and export/import them easily.

When creating new datatypes, I want you to always create a reusable central dataset for them instead of creating one time use datasets!

as an example: If new feature is being worked on and it requires worker roles, these roles should not be hardcoded for that specific feature, but first created as a importable dataset and be imported. Later when we require the roles feature somewhere else, these same role dataset should be imported.

# Building
When building or implementing something. Think broather. What I mean with this is that, when I say that I want you to edit the navigation bar for one page, I want you to take that navigation bar, create a single component that can be used on every other page and edit it this way so that the new features stay consistent acros pages.

Everything needs to be universal and component based unless mentioned otherwise.

If I tell you to implement something, where the same component is used somewhere else you will obviously make it work for the other pages as well and not by hand, but by creating a single component that can be used anywhere.

These components will obviously require parameters in order to be customized per page, but still if duplicate code can be avoided and a single source of truth can be set up, we will do that.

This way when we implement a new feature or change how something looks, it will automatically be used in other places as well.