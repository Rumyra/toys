---
layout: toy.html
title:  "My Journey of DevOps Discovery"
date:   2018-01-02
tags: devops
summary: "I'm going to take you on a journey. This is the journey of my career thus far and the discoveries that have made dealing with DevOps more pleasant."
---
I'm going to take you on a journey. This is the journey of my career thus far and the discoveries that have made dealing with DevOps more pleasant.

{{> picture alt="Photo by Tegan Mierle on Unsplash" url="/images/journey.jpg" caption="<a href='https://unsplash.com/photos/ioyEITUD2G8'>Photo of a figure in a hoody walking down a road by Tegan Mierle on Unsplash</a>" }}

First I want to make something clear. I consider myself a JavaScript developer, previously a Java and .Net developer. Throughout my career I've technically been a "Full Stack" developer but operations have never been my passion. Anything I can do to make the ops side of things easier leaves me with more time to code - more time to do what I love.

What follows is a progression of techniques I use to make managing servers easier. I am not suggesting that one technique replaces the prior though. There are times when each of these techniques can be useful to me today.

So let's start way back at the beginning with young naïve Marcus and how he approached all server configuration and management:

## Welcome to the terminal

When I was first learning about managing servers all my interaction was through either entering commands in the command line (usually copy & pasted from StackOverflow) or running some installer directly on the machine. Servers were unique, well cared for creatures. Each had their own quirks and were often jack-of-all-trades machines, running several different applications. When something new needed installing I would log on to each machine and repeat the same process to get whatever is needed set up.

This took time, my clumsy fingers made mistakes and I constantly feared hard drive corruption. There was little to no documentation to say exactly how each machine was setup and configured. Production and dev machines could have their differences without anyone being aware and new staff were nervous to make changes fearing what impact it could have.

Clearly this wasn't going to scale much. We need something better. We need reproducibility.

## Say hello to bash scripts

The next logical step was to put those manually typed commands into a bash or batch script to make it easier to apply to multiple machines. We still need to run the file on each server but now we can be sure that the same commands are run on each - assuming each are already set up the same.

Bash scripts also have the added documentation of being self-documenting (sort-of). If you want to know how a server is configured and setup you can just read the code in the bash script and get an understanding of what was run.

But this is still time consuming - rather than copy & pasting these commands into a terminal window we are putting them into a script instead (often both as we want to check it actually works first). These scripts are hard to maintain as it's very rare they can be re-run on the same machine without unwanted side-effects. Emergency hotfixes applied directly to production machines can quite easily be forgotten about and not back-ported to other machines or scripts.

Clearly we need to do more.

## It's time to automate repetitive tasks

Wouldn't it be wonderful if we could tell the computer what we want it to have installed and it went away and figured out the _if_ and _hows_? That's exactly what **configuration management tools** like [Ansible](https://www.ansible.com/) and [Chef](https://www.chef.io/) do.

With these tools we can create small tasks that handle a piece of software and then we can use those tasks in larger descriptor files of our servers.

<small>Example NodeJS role in Ansible:</small>

```
# Install Node.js using packages crafted by NodeSource
---
- name: Import the NodeSource GPG key into apt
  apt_key:
    url: https://keyserver.ubuntu.com/pks/lookup?op=get&fingerprint=on&search=0x1655A0AB68576280
    id: "68576280"
    state: present

- name: Add NodeSource deb repository
  apt_repository:
    repo: 'deb https://deb.nodesource.com/node_\{{ debian_repo_version }} \{{ ansible_distribution_release }} main'
    state: present

- name: Install Node.js
  apt:
    pkg:
      - nodejs
    state: installed
    update_cache: yes
```

When this role is referenced in our "playbook" (Ansible speak for server configuration file) Ansible will keep track of whether it needs to install NodeJS or not. If it's the first time being run on that machine it will go off, add the repository, install NodeJS and then keep a note of doing so. Subsequent runs on the playbook will skip over the NodeJS role unless there are changes made to it.

This is wonderful, no longer do we have to worry about how our servers are set up. We can stop treating them as special, unique beasts and start thinking of them as simply a resource to be used up. We can now configure many servers with ease but we still need to go through the process of creating each of those servers, setting up networking, data stores etc.

Still more boring Ops work we can automate.

## Infrastructure as code

This is what has me most excited. As I said at the start of this article, I love to code and want to spend more of my time doing it. Being able to code infrastructure is amazing.

So what exactly do I mean? Tools such as [Terraform](https://www.terraform.io/) allow us to create descriptor files that outline what we want from a cloud provider (servers, databases, networking, security, etc.) and will go off and automatically provision it all for us.

<small>Example MySQL instance in AWS using Terraform:</small>

```
module "db" {
  identifier = "demodb"

  engine            = "mysql"
  engine_version    = "5.7.19"
  instance_class    = "db.t2.large"
  allocated_storage = 5
  storage_encrypted = false

  name     = "demodb"
  username = "user"
  password = "Secret!"
  port     = "3306"
}
```

Having our infrastructure in code gives us all the same benefits as with our source code:
 - we get a history of all changes by using a version controls system and because of this, easy rollbacks and accountability.
 - reproducibility - all servers in our production and test environments can be identical.
 - infrastructure can be stored alongside our application code and can be used by our <abbr title="Continuous Integration">CI</abbr> tools to automate creation of new resources.
 - self-documenting.

This is where I was at the start of last year. It's a good place to be as it takes a lot of the stress out of managing servers. When you start working with hundreds of microservices though, it can become a new kind of headache. Depending on how you structure your infrastructure you could end up with the same infrastructure code repeated again and again for each of your microservices - each with their own machine instance, their own load balancer and auto scaling group. You end up with a LOT of infrastructure to manage and all the financial costs that come with that.

So where do we go next?

## Containers

{{> picture url="/images/containers.jpg" alt="Photo of shipping containers by frank mckenna on Unsplash" caption="<a href='https://unsplash.com/photos/tjX_sniNzgQ'>Photo by frank mckenna on Unsplash</a>" }}

This is where I'm at today.

In the early days of [Docker](https://www.docker.com/), when the technology wasn't as mature as it is today, running production services within containers could be risky. When things went right it was great, but when things went wrong and you needed to debug the issue you had a whole new layer of complexity to debug. While this is still true to some extent today, things have come a long way.

Enter [Kubernetes](https://kubernetes.io/) - "production-grade container orchestration" as they call it. In it's most simple form, Kubernetes runs containers (be that Docker or otherwise) but there is so much more to it than that. One of the core concepts of Kubernetes is that of "desired state" and declarative configuration. You provide Kubernetes with a configuration (a yaml or json file) of _what_ you want and it figures out the _how_. Kubernetes has a collection of controllers that constantly run and compare the current state of running services against the supplied desired state. If it finds any discrepancy it works to rectify it.

<small>Example of a Kubernetes deployment with a load balancer in front of two instances:</small>

```
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: k8s-example
spec:
  selector:
    matchLabels:
      app: k8s-example
  replicas: 2                                     # Number of instances to run within the cluster
  template:                                       # This template is used to create the Kubernetes pods
    metadata:
      labels:
        app: k8s-example
    spec:
      containers:
      - name: k8s-example
        image: http://example.com/k8s-example     # The Docker image to run within the container
        ports:
        - containerPort: 3000

---

apiVersion: v1
kind: Service
metadata:
  name: k8s-example
spec:
  type: LoadBalancer
  ports:
  - port: 3000
  selector:
    app: k8s-example
```

There's some really exciting things that can be done with Kubernetes. My personal favourite right now is the ability to spin up a deployed version of every pull request in it's own namespace within a Kubernetes cluster. This makes it much easier for others in my team to review UI changes as they have a working version they can take a look at without the frustrations that come from a shared dev environment.

## What's next?

Things are pretty exciting right now. Both server resources and installed software can be coded and automated, taking much of the pain out of dealing with operations. So what is left for the future?

I think the next "big thing" in the DevOps world would be the removal of the term "DevOps". We're seeing the developer and operations worlds becoming more and more overlapped and I think this will continue until we see a cultural shift to just referring to these people as developers or similar.

I also foresee security making big strides in the coming years. With all the recent and ongoing data breaches something needs to be done to help make the security of peoples applications clearer as they're no longer involved in the nitty-gritty details of things.

---

I'm pretty excited to talk about this stuff with anyone who's interested. Feel free to reach out to me on [Twitter](https://twitter.com/Marcus_Noble_) or [Mastodon](https://mastodon.social/@AverageMarcus).
