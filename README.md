
# ![aws_toolbox_36](https://i.imgur.com/pwVxlOD.png) AWS Toolbox: Real-time AWS Resource Monitoring

AWS Toolbox is an innovative, open-source Visual Studio Code extension designed to enable developers and cloud engineers to manage and interact with AWS services directly within their editor. It offers a streamlined workflow for AWS resource management, making it an indispensable tool for enhancing AWS operations within VS Code.


![screen shot](https://s3.eu-north-1.amazonaws.com/cloudtoolbox.tech/app/ss-2.png)

![screen shot](https://s3.eu-north-1.amazonaws.com/cloudtoolbox.tech/app/ss-1.png)
## Features

- **Service List Navigation**: Easily navigate and access a wide array of AWS services such as AWS VPC, S3, Lambda, and more.
- **Region-Based Resource Management**: Manage resources effectively by region with a clear and organized interface.
- **Visual Analytics**: Gain real-time insights with analytics on resource usage like bucket counts, storage, and data size across various regions.
- **Profile Management**: Switch seamlessly between different AWS profiles for efficient management of multiple accounts.

## Getting Started

### Step 1: Select AWS Services to Monitor

![Select Services](https://i.imgur.com/a3nJe4U.png)

---

### Step 2: Copy Auto Generated IAM Read-only Policy

This VS Extension is Open Source. It does not collect any info about your computer. Just for your safety Please use Fine tuned IAM Read-Only Policy below.

#### IAM READ-ONLY Policy

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "vpc",
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeVpcs",
                "ec2:DescribeSubnets",
                "ec2:DescribeRouteTables",
                "ec2:DescribeInternetGateways",
                "ec2:DescribeNatGateways",
                "ec2:DescribeVpcPeeringConnections",
                "ec2:DescribeRegions"
            ],
            "Resource": "*"
        },
      
    ]
}
```

---

### Step 3: Create a User in your AWS Account

![Create User](https://s3.eu-north-1.amazonaws.com/cloudtoolbox.tech/app/ctb-01.gif)

---

### Step 4: Create Access Key for the Created User

!!! Save Access key and Secret Key

![Create Access Key](https://s3.eu-north-1.amazonaws.com/cloudtoolbox.tech/app/ctb-02.gif)

---

### Step 5: Download and Install AWS CLI

Download from [AWS CLI Official Site](https://aws.amazon.com/cli/)

![Install AWS CLI](https://s3.eu-north-1.amazonaws.com/cloudtoolbox.tech/app/ctb-03.gif)

---

### Step 6: Setup AWS Profile using Terminal

![Setup AWS Profile](https://s3.eu-north-1.amazonaws.com/cloudtoolbox.tech/app/ctb-04.gif)

---

### Step 7: Restart VS Code

Now you can see your profile with default profile name.

![VS Code Profile](https://i.imgur.com/xUO4FQG.png)


### Configuration
1. Configure your AWS credentials following the [AWS CLI Setup Guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).
2. Reload VS Code to activate the extension.

### Usage
1. Expand the `AWS Service List` in the Side Bar to access available AWS services.
2. Select a region from the dropdown to filter resources for that area.
3. Navigate through different services to manage your resources.

## Special Thanks
 - [Ezgi Akdag](https://www.linkedin.com/in/ezgi-akdag-3564ab15/) @amazon.com
 - [Dr. Ertugrul Akbas](https://www.linkedin.com/in/drertugrulakbas/)
 - [Yusuf Ulaş Yıldız](https://www.linkedin.com/in/ulas-yildiz-7561a688/)
 - [Highcharts.com](https://www.highcharts.com/)


## Documentation & Resources

- [AWS Documentation](https://aws.amazon.com/documentation/)
- [VS Code Extension API](https://code.visualstudio.com/api)


## Contributing

Contributions are welcome! Fork the repository, submit pull requests, or open issues to discuss changes or report problems.

## Support

Encounter an issue? Please file it on the [GitHub repository issue tracker](https://github.com/sinanartun/cloudtoolbox/issues).

## License

AWS Toolbox is distributed under the MIT License. See the `LICENSE` file for more details.

## Acknowledgments

- Thanks to the open-source community for their continuous support and inspiration.

---

© 2024 AWS Toolbox by [Sinan ARTUN](https://www.linkedin.com/in/sinanartun/). Built with ❤ for the cloud community.


![linkedin](https://i.imgur.com/S2TY9ge.png)  [![Patreon](https://s3.eu-north-1.amazonaws.com/cloudtoolbox.tech/app/patreon.png)](https://patreon.com/CloudToolbox)
