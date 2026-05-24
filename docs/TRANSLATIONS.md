# Translations
Thank you for wanting to contribute a translation to the Ambassador program! This will help us better expand our reach to all of the regions. Translations are accepted through a process where you must make a PR in this repository and after approval by managers your translation will be added to the website. 

# Where do I find the source posters?
All four of the poster files you need to translate can be found [here](https://www.figma.com/design/1hOz2fIcUzURZksp8Df9qb/Stardance-Ambassador-Posters). This link is also available in the handbook. 

# What is the process?
- As a general principle, the platform serves 4 types of posters: A4 Color, Letter Color, A4 B&W and Letter B&W. 
- These posters are also accompanied by a webp preview of the poster that is shown on the website.
- Therefore, you must translate 4 versions of the poster and include 4 webp files (you can convert your PDFs [here](https://cloudconvert.com/webp-converter))

# Ok, what files do I have to commit?
You must commit your posters to the public/posters/stardance/regionals folder. The naming scheme is as follows:

```
stardance-letter-color-(region).pdf
stardance-letter-color-(region).webp
stardance-letter-bw-(region).pdf
stardance-letter-bw-(region).webp
stardance-a4-color-(region).pdf
stardance-a4-color-(region).webp
stardance-a4-bw-(region).pdf
stardance-a4-bw-(region).webp
```

The (region) is your country's 2 letter code. For example, for the United States one poster would be `stardance-letter-color-us.pdf`.

**All posters are mandatory, even if your country does not use letter for example. This is for consistency.**

# What do I label the PR?
A simple `translate: (region)` is enough. Like `translate: US`.

# What else do I need?
You must also attach a [VirusTotal](https://virustotal.com) link so we can ensure that your PDFs don't have any malicious scripts attached. Please zip all 8 files so you can upload them at once for your convenience. A manager will take a look at your poster designs before merging the PR. 

There is an automated CI check as well that will make sure you have added the posters in the correct way, please make sure it's passing to ensure that your PR can be merged without issues. Label the PR as "Translation".

# My posters are applicable to more than one country
After you get approval from a manager, you can duplicate the same 8 files for every other country where said posters are applicable!

# Need more help?
Ask in `#hq-ambassadors-support`!