# Generating Images

## Main images

Generate prompts file with `scripts/generate-prompts.js`

    cd scripts
    node generate-prompts.js > prompts.txt

Use ComfyUI workflow as a guide, and the `prompts.txt` as input to the "Text Load Line From File" node from the WAS node suite.

Queue up correct number of images to match the number of prompts in the file. This should generate and save images with filenames matching the prompt, e.g

    style of Arnold Bocklin.webp
    style of Ambrosius Bosschaert.webp
    style of Mary Blair.webp
    style of John T. Biggers.webp

Each image is a 2x2 grid with total 2048x2048 size, so each individual image is 1024x1024.

Resize these images to 1024x1024 using a tool of your choice and save them to the `/img/flux/` dir.

## Style images

Coming soon.
